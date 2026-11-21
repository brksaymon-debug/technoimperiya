import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { api } from './api';
import { demoProducts, type Product } from './catalog';
type Cart = Record<string,number>;
type Panel = 'cart'|'favorites'|null;
type ShopValue = {catalogLoading:boolean;catalogError:string;reloadProducts:()=>Promise<void>;clearCart:()=>void;unavailableCount:number;clearUnavailable:()=>void;demo:boolean;setDemo:(x:boolean)=>void;products:Product[];cart:Cart;favorites:string[];cartCount:number;favoriteCount:number;add:(id:string)=>void;quantity:(id:string,n:number)=>void;toggleFavorite:(id:string)=>void;drawer:Panel;openDrawer:(p:Panel)=>void;closeDrawer:()=>void;motionOff:boolean;setMotionOff:(v:boolean)=>void;toast:string;notify:(s:string)=>void};
function load<T>(key:string,fallback:T):T {try {return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}}
const Context=createContext<ShopValue|null>(null);
export function ShopProvider({children}:{children:ReactNode}) {
 const [demo,setDemoState]=useState(()=>load<boolean>('ti-demo',false)===true);
 const [cart,setCart]=useState<Cart>(()=>{const raw=load<Cart>('ti-cart',{});return Object.fromEntries(Object.entries(raw&&typeof raw==='object'?raw:{}).filter(([id,n])=>/^(demo-\d{2}|p_[a-f0-9-]{36})$/.test(id)&&Number.isInteger(n)&&n>0&&n<=99));});
 const [favorites,setFavorites]=useState<string[]>(()=>{const raw=load<unknown>('ti-favorites',[]);return Array.isArray(raw)?raw.filter((x):x is string=>typeof x==='string'&&/^(demo-\d{2}|p_[a-f0-9-]{36})$/.test(x)):[];});
 const [drawer,openDrawer]=useState<Panel>(null);const [motionOff,setMotionOff]=useState(()=>load<boolean>('ti-motion',false)===true);const [toast,notify]=useState('');
 const [liveProducts,setLiveProducts]=useState<Product[]>([]);const [catalogLoading,setCatalogLoading]=useState(true);const [catalogError,setCatalogError]=useState('');
 const reloadProducts=useCallback(async()=>{setCatalogLoading(true);try{const data=await api<{products:Product[]}>('/api/products');setLiveProducts(data.products);setCatalogError('')}catch{setCatalogError('Не удалось загрузить каталог. Проверьте соединение и повторите.')}finally{setCatalogLoading(false)}},[]);
 useEffect(()=>{void reloadProducts()},[reloadProducts]);
 const products=demo?demoProducts:liveProducts;
 const unavailableCount=demo||catalogLoading||catalogError?0:Object.keys(cart).filter(id=>id.startsWith('p_')&&!liveProducts.some(p=>p.id===id)).length;
 const closeDrawer=useCallback(()=>openDrawer(null),[]);
 useEffect(()=>{try{localStorage.setItem('ti-cart',JSON.stringify(cart));}catch{}},[cart]);
 useEffect(()=>{try{localStorage.setItem('ti-favorites',JSON.stringify(favorites));}catch{}},[favorites]);
 useEffect(()=>{try{localStorage.setItem('ti-demo',JSON.stringify(demo));}catch{}},[demo]);
 useEffect(()=>{try{localStorage.setItem('ti-motion',JSON.stringify(motionOff));}catch{}document.documentElement.classList.toggle('motion-off',motionOff);},[motionOff]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>notify(''),3000);return()=>clearTimeout(t)},[toast]);
 const activeCart=Object.fromEntries(Object.entries(cart).filter(([id])=>products.some(p=>p.id===id)));
 const activeFavorites=favorites.filter(id=>products.some(p=>p.id===id));
 const setDemo=(next:boolean)=>{setDemoState(next);openDrawer(null);notify(next?'Демо включено. Все товары и цены — примеры.':'Демо выключено. Открыт настоящий каталог.');};
 return <Context.Provider value={{catalogLoading,catalogError,reloadProducts,unavailableCount,clearUnavailable:()=>setCart(c=>Object.fromEntries(Object.entries(c).filter(([id])=>!id.startsWith('p_')||liveProducts.some(p=>p.id===id)))),clearCart:()=>setCart(c=>Object.fromEntries(Object.entries(c).filter(([id])=>!products.some(p=>p.id===id)))),demo,setDemo,products,cart:activeCart,favorites:activeFavorites,cartCount:Object.values(activeCart).reduce((a,b)=>a+b,0),favoriteCount:activeFavorites.length,drawer,openDrawer,closeDrawer,motionOff,setMotionOff,toast,notify,add:(id)=>{const p=products.find(p=>p.id===id);if(!p)return;const max=demo?99:Math.min(99,p.stock??0);if(!max){notify('Товар закончился.');return}setCart(c=>({...c,[id]:Math.min(max,(c[id]||0)+1)}));notify(demo?'Пример добавлен в корзину':'Товар добавлен в корзину')},quantity:(id,n)=>setCart(c=>{const next={...c};if(n<=0)delete next[id];else {const p=products.find(p=>p.id===id);const max=demo?99:Math.min(99,p?.stock??0);if(max)next[id]=Math.min(max,n);else delete next[id];}return next;}),toggleFavorite:(id)=>setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id])}}>{children}</Context.Provider>;
}
export function useShop(){const c=useContext(Context);if(!c)throw Error('ShopProvider is missing');return c;}
