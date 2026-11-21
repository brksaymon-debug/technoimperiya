from pathlib import Path
import os, shutil, zipfile, hashlib, json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parent
BACKUP=OUT/'technoimperiya-before-managed-store'
BACKUP.mkdir(exist_ok=True)
for name in ['technoimperiya-local-source.zip','technoimperiya-local-static.zip']:
    old=OUT/name
    if old.exists() and not (BACKUP/name).exists(): shutil.copy2(old,BACKUP/name)
EXCLUDE={'node_modules','dist','.git','__pycache__','.cache','uploads'}
def allowed(p):
    name=p.name
    return (not p.is_symlink() and not any(x in EXCLUDE for x in p.relative_to(ROOT).parts)
        and (not name.startswith('.env') or name=='.env.example')
        and '.sqlite' not in name and not name.endswith(('.db','.db-wal','.db-shm','.zip','.tsbuildinfo'))
        and name!='admin-auth.json')
source=OUT/'technoimperiya-managed-store-source.zip'
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for base,dirs,files in os.walk(ROOT):
        dirs[:]=[d for d in dirs if d not in EXCLUDE and not Path(base,d).is_symlink()]
        for name in files:
            p=Path(base,name)
            if allowed(p): z.write(p,'technoimperiya-local/'+p.relative_to(ROOT).as_posix())
production=OUT/'technoimperiya-managed-store-production.zip'
runtime_docker='''FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY server ./server
COPY dist ./dist
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080 DATA_DIR=/var/lib/technoimperiya
RUN mkdir -p /var/lib/technoimperiya && chown -R node:node /app /var/lib/technoimperiya
USER node
EXPOSE 8080
CMD ["node","server/app.mjs"]
'''
with zipfile.ZipFile(production,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for d in ['dist','server','docs']:
        for p in ROOT.joinpath(d).rglob('*'):
            if p.is_file() and not p.is_symlink() and not p.name.endswith('.test.mjs'):
                z.write(p,'technoimperiya-managed-store/'+p.relative_to(ROOT).as_posix())
    for f in ['package.json','package-lock.json','.env.example','compose.yaml','DEPLOYMENT-BLOCKER.md','MANAGED-STORE-COMPLETION.md']:
        z.write(ROOT/f,'technoimperiya-managed-store/'+f)
    z.writestr('technoimperiya-managed-store/Dockerfile',runtime_docker)
    z.writestr('technoimperiya-managed-store/README.md','''# Техноимперия — готовый Node runtime
Нужен Node 24.22+ (24.x) и постоянный диск. dist уже собран, не запускайте build в этом runtime-архиве.
1. npm ci --omit=dev --ignore-scripts
2. Скопируйте .env.example в .env: настоящий SITE_ORIGIN и защищённый DATA_DIR вне public/dist.
3. В собственном терминале npm run setup:admin — задайте свой скрытый пароль.
4. npm start; /admin — товары и заказы.
Для публичного запуска нужен предоставленный владельцем сервер, домен, HTTPS reverse proxy и постоянный DATA_DIR. Сейчас такого deployment нет. Dockerfile/compose подготовлены, но Docker не запускался. Не удаляйте data volume при обновлении.
Детали: docs/MANAGED-STORE.md. Секреты и база не вложены. Онлайн-оплата, уведомления и внешние маркетплейсы не подключены. Статический ZIP не заменяет этот серверный runtime.
''')
static=OUT/'technoimperiya-local-static.zip'
with zipfile.ZipFile(static,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in (ROOT/'dist').rglob('*'):
        if p.is_file(): z.write(p,p.relative_to(ROOT/'dist').as_posix())
    z.writestr('SERVER-REQUIRED.txt','Preview frontend only. Managed inventory, admin and orders REQUIRE the Node API and database. Deploy technoimperiya-managed-store-production.zip instead. No backend or credentials in this static archive.')
shutil.copy2(source,OUT/'technoimperiya-local-source.zip')
manifest=[]
for p in [source,production,static]:
    with zipfile.ZipFile(p) as z:
        assert z.testzip() is None
        assert not any('/admin-auth.json' in n or '.sqlite' in n or n.endswith('/.env') for n in z.namelist())
    manifest.append({'path':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(ROOT/'qc/managed-store-artifacts.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
