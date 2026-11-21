import { mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { hashPassword } from './auth.mjs';
if(!process.stdin.isTTY){console.error('Запустите setup:admin в собственном интерактивном терминале. Пароль не передаётся через аргументы или журналы.');process.exit(1)}
const output=new Writable({write(chunk,enc,cb){if(!output.muted)process.stdout.write(chunk,enc);cb()}});output.isTTY=true;
const rl=createInterface({input:process.stdin,output,terminal:true});
try {
 const username=(await rl.question('Логин администратора [admin]: ')).trim()||'admin';
 process.stdout.write('Пароль (14–256 символов, ввод скрыт): ');output.muted=true;const password=await rl.question('');output.muted=false;process.stdout.write('\n');
 if(username.length>100||password.length<14||password.length>256)throw Error('Пароль должен содержать 14–256 символов, логин — до 100. Ничего не изменено.');
 const dir=resolve(process.env.DATA_DIR||'../technoimperiya-private/data');mkdirSync(dir,{recursive:true,mode:0o700});chmodSync(dir,0o700);const path=join(dir,'admin-auth.json');writeFileSync(path,JSON.stringify({username,hash:hashPassword(password)}),{mode:0o600});chmodSync(path,0o600);
 console.log('Администратор настроен. Старые сессии недействительны. Файл настроек: '+path);
}catch(e){console.error(e.message);process.exitCode=1}finally{rl.close()}
