#!/usr/bin/env python3
"""Separate honest static Pages preview; managed source is never rewritten."""
from pathlib import Path
import sys,shutil,re,subprocess
root=Path(__file__).resolve().parents[1];stage=Path(sys.argv[1]).resolve();clone=stage/'pages-source';clone.mkdir(parents=True,exist_ok=True)
for name in ['src','public','scripts']:
 if (clone/name).exists():shutil.rmtree(clone/name)
 shutil.copytree(root/name,clone/name)
for pattern in ['package*.json','tsconfig*.json','vite.config.*','index.html']:
 for file in root.glob(pattern):shutil.copy2(file,clone/file.name)
if not (clone/'node_modules').exists():(clone/'node_modules').symlink_to(root/'node_modules',target_is_directory=True)
for p in (clone/'src').glob('*.tsx'):
 s=p.read_text();s=re.sub(r'\b(src|poster|srcSet)="(/art/[^"\n]+)"',lambda m:m[1]+'={import.meta.env.BASE_URL+"'+m[2][1:]+'"}',s);s=re.sub(r"(['\"])(/art/[^'\"\n]+)\1",lambda m:'(import.meta.env.BASE_URL+"'+m[2][1:]+'")',s);p.write_text(s)
p=clone/'src/main.tsx';s=p.read_text().replace('BrowserRouter','HashRouter');s+="""\ndocument.addEventListener("click",event=>{const a=(event.target as Element).closest?.('a[href="#main"],a[href="#televisions"]');if(a){event.preventDefault();const target=document.querySelector(a.getAttribute("href")!);target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});(target as HTMLElement)?.focus({preventScroll:true})}});\n""";p.write_text(s)
(clone/'src/vite-env.d.ts').write_text('/// <reference types="vite/client" />\n')
for name in ['api.ts','AdminPreview.tsx']:shutil.copy2(root/'scripts/pages-preview'/name,clone/'src'/name)
p=clone/'src/App.tsx';s=p.read_text().replace("import('./Admin')","import('./AdminPreview')");s=re.sub(r'function DemoNotice\(\)\{.*?\}\n','function DemoNotice(){return <div className="store-notice" role="note">Предпросмотр · демо-товары не продаются. Заказы и оплата недоступны.</div>}\n',s);p.write_text(s)
p=clone/'index.html';s=p.read_text().replace('<html lang="ru">','<html lang="ru" data-preview="static">').replace('href="/art/','href="/technoimperiya/art/').replace('src="/art/','src="/technoimperiya/art/').replace('href="/"','href="/technoimperiya/"');s=s.replace('</head>','<meta property="og:image" content="https://brksaymon-debug.github.io/technoimperiya/art/brand-header-transparent.png"><meta property="og:url" content="https://brksaymon-debug.github.io/technoimperiya/"></head>');p.write_text(s)
p=clone/'public/404.html';s=p.read_text().replace('src="/art/','src="/technoimperiya/art/').replace('href="/"','href="/technoimperiya/"').replace('href="/catalog"','href="/technoimperiya/#/catalog"');p.write_text(s)
subprocess.run([str(root/'node_modules/.bin/tsc'),'-b','--pretty','false'],cwd=clone,check=True);subprocess.run([str(root/'node_modules/.bin/vite'),'build','--configLoader','native','--base','/technoimperiya/','--outDir',str(stage/'docs')],cwd=clone,check=True);(stage/'docs/.nojekyll').touch();print(stage/'docs')
