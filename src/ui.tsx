import { useEffect, useRef, ViewTransition, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from './shop';
import { money, productFeatures, type Product } from './catalog';
export function Icon({name,size=22}:{name:string;size?:number}) {
 const paths:Record<string,ReactNode>={
 compare:<><rect x="3" y="5" width="7" height="14" rx="1.5"/><rect x="14" y="5" width="7" height="14" rx="1.5"/><path d="M10 9h4M10 15h4"/></>,
 search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
 cart:<><path d="M3 3h2l3 12h11l2-9H6M9 19h.01M18 19h.01"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></>,
 heart:<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>,
 user:<><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
 grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
 home:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></>,
 percent:<><path d="m5 20 14-16"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/></>,
 flame:<path d="M13 3c1 5-4 6-3 10 2 0 4-2 4-4 4 3 6 5 5 8a7 7 0 0 1-14 0c-1-5 5-7 8-14Z"/>,
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,close:<path d="m6 6 12 12M6 18 18 6"/>,check:<path d="m5 12 4 4L19 6"/>,
 tv:<><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8m-4-4v4"/></>,
 box:<><path d="m12 2 10 5v10l-10 5-10-5V7l10-5Zm0 10 10-5M2 7l10 5v10M7 4.5l10 5V13"/></>,
 audio:<><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="12" width="5" height="9" rx="2"/><rect x="17" y="12" width="5" height="9" rx="2"/></>,
 shield:<><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/></>,
 menu:<path d="M3 6h18M3 12h18M3 18h18"/>,plus:<path d="M5 12h14M12 5v14"/>,minus:<path d="M5 12h14"/>,
 filter:<><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="9" cy="18" r="2"/></>,
 play:<path d="m9 4 12 8-12 8V4Z"/>,pause:<><path d="M8 5v14M16 5v14"/></>,info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
 gift:<><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8C1 8 5-2 12 8c7-10 11 0 0 0Z"/></>,
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.box}</svg>
}
export function Logo(){return <Link data-tv-focus to="/" className="logo" aria-label="Техноимперия — главная"><span>ТЕХНО<i>///</i></span><strong>ИМПЕРИЯ</strong></Link>}
export function Television({color='mountain',large=false}:{color?:'mountain'|'red';large?:boolean}){return <div className={'television '+color+(large?' large':'')} aria-hidden="true"><div className="tv-bezel"><div className="product-screen"><img src={color==='mountain'?'/art/screen-landscape.webp':'/art/screen-red.webp'} alt="" loading="lazy"/></div><span>ТЕХНО</span></div><div className="tv-feet"/></div>}
export function ProductCard({product:p,shared=false}:{product:Product;shared?:boolean}) {
 const shop=useShop();const features=productFeatures(p,shop.demo);
 return <article className="product-card"><div className="product-visual"><span className="condition">{p.condition}</span><button data-tv-focus className={'icon-button favorite '+(shop.favorites.includes(p.id)?'selected':'')} aria-label={`${shop.favorites.includes(p.id)?'Убрать из':'Добавить в'} избранное: ${p.name}`} aria-pressed={shop.favorites.includes(p.id)} onClick={()=>shop.toggleFavorite(p.id)}><Icon name="heart" size={20}/></button><Link data-tv-focus onClick={shop.closeDrawer} className="product-image-link" to={'/product/'+p.id} aria-label={p.name}>{shared?<ViewTransition name={'catalog-tv-'+p.id} share="product-morph" default="none"><div className="product-image-transition">{p.image?<img className="real-product-image" src={p.image} alt={p.name} loading="lazy"/>:<Television color={p.color}/>}</div></ViewTransition>:(p.image?<img className="real-product-image" src={p.image} alt={p.name} width="640" height="360" loading="lazy"/>:<Television color={p.color}/>)}</Link></div><div className="product-copy"><span className="demo-label">{shop.demo?'ДЕМО · НЕ ДЛЯ ПРОДАЖИ':'СОСТОЯНИЕ ОПИСАНО В КАРТОЧКЕ'}</span><Link data-tv-focus onClick={shop.closeDrawer} className="product-name" to={'/product/'+p.id}>{p.name}</Link><p>{features.join(' · ')||'Характеристики в карточке'}</p><div className="product-bottom"><div><small>{shop.demo?'Пример цены':'Цена товара'}</small><strong>{money(p.price)}</strong></div><button data-tv-focus className="add-button" disabled={!shop.demo&&!p.stock} aria-label={'В корзину: '+p.name} onClick={()=>shop.add(p.id)}><Icon name={shop.cart[p.id]?'check':'cart'} size={20}/><span>{!shop.demo&&!p.stock?'Нет в наличии':shop.cart[p.id]?'Ещё':'В корзину'}</span></button></div></div></article>
}
export function Modal({title,children,onClose,wide=false}:{title:string;children:ReactNode;onClose:()=>void;wide?:boolean}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const before=document.activeElement as HTMLElement;const scroll=document.body.style.overflow;document.body.style.overflow='hidden';ref.current?.focus();const handle=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const nodes=ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a,input,select,textarea,[tabindex="0"]');if(!nodes?.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};document.addEventListener('keydown',handle);return()=>{document.body.style.overflow=scroll;document.removeEventListener('keydown',handle);before?.focus()}},[onClose]);
 return <div className="modal-backdrop" onClick={onClose}><div role="dialog" aria-modal="true" aria-label={title} className={'modal '+(wide?'wide':'')} ref={ref} tabIndex={-1} onClick={e=>e.stopPropagation()}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Закрыть"><Icon name="close"/></button></div>{children}</div></div>
}
export function Empty({icon='box',title,children}:{icon?:string;title:string;children:ReactNode}){return <div className="empty"><div className="empty-icon"><Icon name={icon} size={36}/></div><h3>{title}</h3>{children}</div>}
