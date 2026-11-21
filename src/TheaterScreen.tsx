import { useLayoutEffect, useRef } from 'react';
import { SCREEN_QUAD } from './geometry';
import { quadMatrix } from './project';
/** Illustration mapped into the supplied television; never presented as a product photograph. */
export function TheaterScreen({color}:{color:'mountain'|'red'}){
 const ref=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{const layer=ref.current;const frame=layer?.closest('.hero-art');if(!layer||!(frame instanceof HTMLElement))return;const apply=()=>{const r=frame.getBoundingClientRect();const p=(x:readonly[number,number])=>[x[0]*r.width,x[1]*r.height] as const;layer.style.transform=quadMatrix(960,540,p(SCREEN_QUAD.tl),p(SCREEN_QUAD.tr),p(SCREEN_QUAD.bl),p(SCREEN_QUAD.br));};apply();const observer=new ResizeObserver(apply);observer.observe(frame);return()=>observer.disconnect()},[]);
 const point=(p:readonly[number,number])=>`${p[0]*100}% ${p[1]*100}%`;
 return <div aria-hidden="true" className="theater-glass" style={{clipPath:`polygon(${point(SCREEN_QUAD.tl)},${point(SCREEN_QUAD.tr)},${point(SCREEN_QUAD.br)},${point(SCREEN_QUAD.bl)})`}}><div ref={ref} className="theater-glass-image"><img src={color==='red'?'/art/screen-red.webp':'/art/screen-landscape.webp'} alt="" width="960" height="540"/></div></div>
}
