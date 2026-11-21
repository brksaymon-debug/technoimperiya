import express from 'express';
import sharp from 'sharp';
import { z } from 'zod';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, existsSync, chmodSync } from 'node:fs';
import { writeFile, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyPassword, digest } from './auth.mjs';

const text=(max,min=0)=>z.string().trim().min(min).max(max);
const photo=z.string().regex(/^\/media\/[0-9a-f-]{36}\.webp$/);
const productSchema=z.object({
 name:text(180,2),brand:text(70,1),category:z.enum(['tv','audio','home','accessories']),
 price:z.number().finite().min(0.01).max(100000000).refine(n=>Math.abs(n*100-Math.round(n*100))<0.00001,'Цена: не более двух знаков после запятой'),
 stock:z.number().int().min(0).max(100000),diagonal:z.number().finite().min(0).max(200),
 condition:z.enum(['Новый','Уценка','Витринный образец','Распродажа']),
 reason:text(2000),description:text(10000),photos:z.array(photo).max(8),
 features:z.array(text(140,1)).max(12),specs:z.record(text(80,1),text(400,1)).refine(x=>Object.keys(x).length<=40),
 published:z.boolean(),
}).strict();
const orderSchema=z.object({customer:z.object({name:text(120,2),phone:text(32,10).refine(x=>/^\+?[\d\s()\-]+$/.test(x)&&x.replace(/\D/g,'').length>=10&&x.replace(/\D/g,'').length<=16),email:z.email().max(254),delivery:z.enum(['pickup','courier']),address:text(500)}).strict().refine(c=>c.delivery!=='courier'||c.address.length>=8,{message:'Укажите адрес доставки'}),items:z.array(z.object({id:text(80,1),quantity:z.number().int().min(1).max(99)}).strict()).min(1).max(50),expectedTotalCents:z.number().int().positive().max(1000000000000)}).strict();
class HttpError extends Error {constructor(status,message){super(message);this.status=status;}}
export function createStore(options={}) {
 const dataDir=resolve(options.dataDir||process.env.DATA_DIR||'../technoimperiya-private/data');
 const origin=options.origin||process.env.SITE_ORIGIN||'http://127.0.0.1:5174';
 const origins=new Set([origin,...(process.env.ADDITIONAL_ORIGINS||'').split(',').filter(Boolean)]);
 const secure=options.secureCookie??new URL(origin).protocol==='https:';
 if(process.env.NODE_ENV==='production'&&!secure&&!['127.0.0.1','localhost'].includes(new URL(origin).hostname))throw Error('Public production requires an HTTPS SITE_ORIGIN.');
 mkdirSync(dataDir,{recursive:true,mode:0o700});chmodSync(dataDir,0o700);
 const uploadDir=join(dataDir,'uploads');mkdirSync(uploadDir,{recursive:true,mode:0o700});
 const db=new DatabaseSync(join(dataDir,'store.sqlite'));chmodSync(join(dataDir,'store.sqlite'),0o600);
 db.exec(`PRAGMA journal_mode=WAL;PRAGMA foreign_keys=ON;PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY,data TEXT NOT NULL,price_cents INTEGER NOT NULL CHECK(price_cents>0),stock INTEGER NOT NULL CHECK(stock>=0),published INTEGER NOT NULL DEFAULT 0,archived INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 1);
 CREATE TABLE IF NOT EXISTS uploads(path TEXT PRIMARY KEY,bytes INTEGER NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,expires_at INTEGER NOT NULL,auth_version TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,idempotency_key TEXT UNIQUE NOT NULL,request_hash TEXT NOT NULL,customer TEXT NOT NULL,items TEXT NOT NULL,total_cents INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'new',created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
 INSERT OR IGNORE INTO migrations VALUES(1,strftime('%Y-%m-%dT%H:%M:%fZ','now'));`);
 const app=express();app.disable('x-powered-by');if(process.env.TRUST_PROXY==='1')app.set('trust proxy',1);
 app.use((req,res,next)=>{res.set({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"});if(secure)res.set('Strict-Transport-Security','max-age=31536000');if(req.path.startsWith('/api/'))res.set('Cache-Control','no-store');next()});
 app.use('/api',(req,res,next)=>{if(!['GET','HEAD','OPTIONS'].includes(req.method)&&!origins.has(req.get('Origin')))return res.status(403).json({error:'Запрос с другого сайта запрещён.'});next()});
 app.use(express.json({limit:'256kb',strict:true}));
 const limiters=new Map();
 function limited(req,scope,max,ms){const key=scope+':'+req.ip;const now=Date.now();if(limiters.size>10000)for(const[k,v]of limiters)if(v.until<now)limiters.delete(k);let hit=limiters.get(key);if(!hit||hit.until<now){hit={count:0,until:now+ms};limiters.set(key,hit)}if(++hit.count>max)throw new HttpError(429,'Слишком много попыток. Попробуйте позже.');}
 function authConfig(){if(process.env.ADMIN_PASSWORD_HASH)return {username:process.env.ADMIN_USERNAME||'admin',hash:process.env.ADMIN_PASSWORD_HASH};if(options.adminHash)return {username:options.adminUser||'admin',hash:options.adminHash};try{const value=JSON.parse(readFileSync(join(dataDir,'admin-auth.json'),'utf8'));if(typeof value.username==='string'&&typeof value.hash==='string')return value}catch{}return null;}
 function session(req){const token=(req.get('Cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('ti_session='))?.slice(11);if(!token||!/^[0-9a-f]{64}$/.test(token))return null;const auth=authConfig();if(!auth)return null;return db.prepare('SELECT token_hash FROM sessions WHERE token_hash=? AND expires_at>? AND auth_version=?').get(digest(token),Date.now(),digest(auth.hash));}
 const requireAdmin=(req,res,next)=>{if(!session(req))return res.status(401).json({error:'Войдите в кабинет администратора.'});next()};
 const cookie=(token,age)=>`ti_session=${token}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${age}${secure?'; Secure':''}`;
 function serialize(row,admin=false){const data=JSON.parse(row.data);return {...data,id:row.id,price:row.price_cents/100,stock:row.stock,image:data.photos[0]||undefined,color:'mountain',...(admin?{published:!!row.published,archived:!!row.archived,createdAt:row.created_at,updatedAt:row.updated_at,version:row.version}:{})};}
 app.get('/api/health',(req,res)=>res.json({ok:true}));
 app.get('/api/products',(req,res)=>res.json({products:db.prepare('SELECT * FROM products WHERE published=1 AND archived=0 ORDER BY created_at DESC').all().map(r=>serialize(r))}));
 app.get('/api/admin/session',(req,res)=>res.json({authenticated:!!session(req),setupRequired:!authConfig()}));
 app.post('/api/admin/login',(req,res)=>{limited(req,'login',10,15*60*1000);const credentials=z.object({username:text(100,1),password:z.string().min(1).max(256)}).strict().parse(req.body);const config=authConfig();if(!config)throw new HttpError(503,'Администратор ещё не настроен. На сервере выполните npm run setup:admin.');if(!verifyPassword(credentials.password,config.hash)||credentials.username!==config.username)throw new HttpError(401,'Неверный логин или пароль.');db.prepare('DELETE FROM sessions WHERE expires_at<?').run(Date.now());const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(token),Date.now()+8*3600000,digest(config.hash));res.set('Set-Cookie',cookie(token,8*3600)).json({authenticated:true});});
 app.post('/api/admin/logout',requireAdmin,(req,res)=>{const s=session(req);db.prepare('DELETE FROM sessions WHERE token_hash=?').run(s.token_hash);res.set('Set-Cookie',cookie('',0)).json({ok:true})});
 app.get('/api/admin/products',requireAdmin,(req,res)=>res.json({products:db.prepare('SELECT * FROM products WHERE archived=0 ORDER BY updated_at DESC').all().map(r=>serialize(r,true))}));
 app.post('/api/admin/uploads',requireAdmin,express.raw({type:['image/jpeg','image/png','image/webp'],limit:'8mb'}),async(req,res)=>{
  limited(req,'upload',120,3600000);
  if(!Buffer.isBuffer(req.body)||!req.body.length)throw new HttpError(400,'Нужен файл JPEG, PNG или WebP до 8 МБ.');
  let bytes;try{const source=sharp(req.body,{limitInputPixels:25000000,failOn:'warning'});const m=await source.metadata();const expected={'image/jpeg':'jpeg','image/png':'png','image/webp':'webp'}[req.get('Content-Type')?.split(';')[0]];if(!expected||m.format!==expected||(m.pages||1)>1||!m.width||!m.height||m.width<64||m.height<64||m.width>12000||m.height>12000)throw Error('invalid');bytes=await source.rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toBuffer()}catch{throw new HttpError(400,'Изображение повреждено или не поддерживается. JPEG/PNG/WebP, от 64 px, до 25 Мп, без анимации.');}
  const name=randomUUID()+'.webp',url='/media/'+name;await writeFile(join(uploadDir,name),bytes,{mode:0o600,flag:'wx'});try{db.prepare('INSERT INTO uploads VALUES(?,?,?)').run(url,bytes.length,new Date().toISOString())}catch(e){await unlink(join(uploadDir,name));throw e}res.status(201).json({url});
 });
 function validatedProduct(body){const p=productSchema.parse(body);for(const url of p.photos)if(!db.prepare('SELECT path FROM uploads WHERE path=?').get(url)||!existsSync(join(uploadDir,url.slice(7))))throw new HttpError(400,'Сначала загрузите фотографии товара.');if(p.published&&!p.photos.length)throw new HttpError(400,'Для публикации загрузите хотя бы одну фотографию.');return p;}
 app.post('/api/admin/products',requireAdmin,(req,res)=>{const p=validatedProduct(req.body),id='p_'+randomUUID(),now=new Date().toISOString();const {price,stock,published,...data}=p;db.prepare('INSERT INTO products(id,data,price_cents,stock,published,archived,created_at,updated_at) VALUES(?,?,?,?,?,0,?,?)').run(id,JSON.stringify(data),Math.round(price*100),stock,+published,now,now);res.status(201).json({product:serialize(db.prepare('SELECT * FROM products WHERE id=?').get(id),true)})});
 app.put('/api/admin/products/:id',requireAdmin,(req,res)=>{const row=db.prepare('SELECT * FROM products WHERE id=? AND archived=0').get(req.params.id);if(!row)throw new HttpError(404,'Товар не найден.');if(req.get('If-Match')!==String(row.version))throw new HttpError(409,'Товар уже изменён. Обновите список и заново откройте карточку, чтобы не перезаписать остаток.');const p=validatedProduct(req.body);const {price,stock,published,...data}=p;db.prepare('UPDATE products SET data=?,price_cents=?,stock=?,published=?,updated_at=?,version=version+1 WHERE id=?').run(JSON.stringify(data),Math.round(price*100),stock,+published,new Date().toISOString(),req.params.id);res.json({product:serialize(db.prepare('SELECT * FROM products WHERE id=?').get(req.params.id),true)})});
 app.delete('/api/admin/products/:id',requireAdmin,(req,res)=>{const change=db.prepare('UPDATE products SET archived=1,published=0,updated_at=?,version=version+1 WHERE id=? AND archived=0').run(new Date().toISOString(),req.params.id);if(!change.changes)throw new HttpError(404,'Товар не найден.');res.json({ok:true})});
 app.post('/api/orders',(req,res)=>{
  const input=orderSchema.parse(req.body);const key=req.get('Idempotency-Key');if(!key||!z.uuid().safeParse(key).success)throw new HttpError(400,'Не указан ключ запроса. Повторите оформление.');
  const requestHash=digest(JSON.stringify(input));const repeat=db.prepare('SELECT * FROM orders WHERE idempotency_key=?').get(key);if(repeat){if(repeat.request_hash!==requestHash)throw new HttpError(409,'Этот запрос уже использован. Обновите форму.');return res.status(201).json({order:{id:repeat.id,total:repeat.total_cents/100,status:repeat.status}})}
  limited(req,'order',10,15*60*1000);if(new Set(input.items.map(i=>i.id)).size!==input.items.length)throw new HttpError(400,'Повторяющиеся товары.');
  db.exec('BEGIN IMMEDIATE');try{
   const lines=input.items.map(item=>{const p=db.prepare('SELECT * FROM products WHERE id=? AND published=1 AND archived=0').get(item.id);if(!p||p.stock<item.quantity)throw new HttpError(409,'Товар недоступен или изменился остаток. Обновите корзину.');return {id:p.id,name:JSON.parse(p.data).name,quantity:item.quantity,unitPriceCents:p.price_cents};});
   const total=lines.reduce((sum,i)=>sum+i.unitPriceCents*i.quantity,0);if(total!==input.expectedTotalCents)throw new HttpError(409,'Цена изменилась. Проверьте обновлённую корзину и отправьте заказ ещё раз.');
   const id='TI-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+randomBytes(5).toString('hex').toUpperCase();const now=new Date().toISOString();
   db.prepare('INSERT INTO orders VALUES(?,?,?,?,?,?,\'new\',?,?)').run(id,key,requestHash,JSON.stringify(input.customer),JSON.stringify(lines),total,now,now);
   for(const line of lines)db.prepare('UPDATE products SET stock=stock-?,updated_at=?,version=version+1 WHERE id=?').run(line.quantity,now,line.id);
   db.exec('COMMIT');res.status(201).json({order:{id,total:total/100,status:'new'}});
  }catch(e){if(db.isTransaction)db.exec('ROLLBACK');throw e}
 });
 const toOrder=row=>({id:row.id,customer:JSON.parse(row.customer),items:JSON.parse(row.items),total:row.total_cents/100,status:row.status,createdAt:row.created_at});
 app.get('/api/admin/orders',requireAdmin,(req,res)=>{const offset=z.coerce.number().int().min(0).max(10000000).parse(req.query.offset||0);const rows=db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 101 OFFSET ?').all(offset);res.json({orders:rows.slice(0,100).map(toOrder),hasMore:rows.length>100})});
 app.patch('/api/admin/orders/:id',requireAdmin,(req,res)=>{const {status}=z.object({status:z.enum(['confirmed','fulfilled','cancelled'])}).strict().parse(req.body);db.exec('BEGIN IMMEDIATE');try{const order=db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);if(!order)throw new HttpError(404,'Заказ не найден.');const allowed={new:['confirmed','cancelled'],confirmed:['fulfilled','cancelled']};if(!allowed[order.status]?.includes(status))throw new HttpError(409,'Недопустимое изменение статуса.');const now=new Date().toISOString();if(status==='cancelled')for(const i of JSON.parse(order.items))db.prepare('UPDATE products SET stock=stock+?,updated_at=?,version=version+1 WHERE id=?').run(i.quantity,now,i.id);db.prepare('UPDATE orders SET status=?,updated_at=? WHERE id=?').run(status,now,order.id);db.exec('COMMIT');res.json({ok:true})}catch(e){if(db.isTransaction)db.exec('ROLLBACK');throw e}});
 app.get('/media/:name',(req,res)=>{if(!/^[0-9a-f-]{36}\.webp$/.test(req.params.name))return res.sendStatus(404);res.set('Cache-Control','public,max-age=31536000,immutable');res.type('webp').sendFile(join(uploadDir,req.params.name),err=>{if(err&&!res.headersSent)res.sendStatus(404)})});
 app.use('/api',(req,res)=>res.status(404).json({error:'API не найден.'}));
 const dist=resolve(fileURLToPath(new URL('../dist',import.meta.url)));app.use(express.static(dist,{index:false,dotfiles:'deny'}));
 app.get(/.*/,(req,res)=>{if(!req.accepts('html')||/\.[a-z0-9]+$/i.test(req.path))return res.sendStatus(404);const known=/^\/(?:catalog|compare|checkout|contacts|delivery|markdown|sale|account|admin|privacy)?\/?$/.test(req.path)||Boolean(/^\/product\/[^/]+\/?$/.test(req.path)&&db.prepare('SELECT id FROM products WHERE id=? AND published=1 AND archived=0').get(req.path.split('/')[2]));res.status(known?200:404).set('Cache-Control','no-cache').sendFile(join(dist,'index.html'))});
 app.use((err,req,res,next)=>{if(res.headersSent)return next(err);if(err instanceof z.ZodError)return res.status(400).json({error:'Проверьте поля: '+err.issues.map(i=>i.path.join('.')+': '+i.message).join('; ')});if(err.type==='entity.too.large')return res.status(413).json({error:'Превышен допустимый размер файла или запроса.'});if(err instanceof SyntaxError&&'body' in err)return res.status(400).json({error:'Некорректный JSON.'});res.status(err.status||500).json({error:err.status?err.message:'Не удалось выполнить запрос. Попробуйте позже.'});});
 return {app,db,dataDir,close:()=>db.close()};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const store=createStore();const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||5175);const server=store.app.listen(port,host,()=>console.log(`Store listening on http://${host}:${port}; no public deployment configured.`));
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>{store.close();process.exit(0)}));
}
