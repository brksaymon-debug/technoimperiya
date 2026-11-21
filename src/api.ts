export class ApiError extends Error { status:number; constructor(message:string,status:number){super(message);this.status=status;} }
export async function api<T>(path:string,options:RequestInit={}):Promise<T>{
 const headers=new Headers(options.headers);if(typeof options.body==='string')headers.set('Content-Type','application/json');
 const response=await fetch(path,{...options,headers,credentials:'same-origin'});
 const data=await response.json().catch(()=>({error:'Сервер недоступен. Попробуйте позже.'}));
 if(!response.ok)throw new ApiError(data.error||'Не удалось выполнить запрос.',response.status);
 return data as T;
}
