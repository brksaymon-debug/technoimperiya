export class ApiError extends Error {status:number;constructor(message:string,status:number){super(message);this.status=status;}}
export async function api<T>(path:string,_options:RequestInit={}):Promise<T>{if(path==='/api/products')return {products:[]} as T;throw new ApiError('Это статический предпросмотр GitHub Pages. Серверные функции здесь недоступны.',503)}
