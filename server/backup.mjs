import { DatabaseSync } from 'node:sqlite';
import { resolve, join } from 'node:path';
import { existsSync, mkdirSync, cpSync, chmodSync } from 'node:fs';
const dir=resolve(process.env.DATA_DIR||'../technoimperiya-private/data');const target=process.argv[2]&&resolve(process.argv[2]);
if(!target||existsSync(target))throw Error('Укажите НОВЫЙ защищённый каталог резервной копии.');
mkdirSync(target,{recursive:true,mode:0o700});const db=new DatabaseSync(join(dir,'store.sqlite'));db.exec(`VACUUM INTO '${join(target,'store.sqlite').replaceAll("'","''")}'`);db.close();chmodSync(join(target,'store.sqlite'),0o600);
if(existsSync(join(dir,'uploads')))cpSync(join(dir,'uploads'),join(target,'uploads'),{recursive:true});
console.log('Резервная копия товаров, заказов и изображений: '+target+'. Файл администратора сохраните отдельно в защищённом хранилище.');
