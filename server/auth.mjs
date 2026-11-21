import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
export function hashPassword(password) {
 const salt=randomBytes(24).toString('hex');
 return `scrypt$${salt}$${scryptSync(password,salt,64,{N:32768,r:8,p:1,maxmem:67108864}).toString('hex')}`;
}
export function verifyPassword(password,encoded) {
 try { const [kind,salt,hash]=encoded.split('$');if(kind!=='scrypt'||salt.length!==48||hash.length!==128)return false;
 const actual=scryptSync(password,salt,64,{N:32768,r:8,p:1,maxmem:67108864});return timingSafeEqual(actual,Buffer.from(hash,'hex')); }catch{return false;}
}
export const digest=value=>createHash('sha256').update(value).digest('hex');
