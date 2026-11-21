import { useEffect, useRef, useState } from 'react';
import { SCREEN_QUAD } from './geometry';
import { quadMatrix } from './project';
import { useShop } from './shop';
export function TvScreen(){
 const layerRef=useRef<HTMLDivElement>(null); const {motionOff}=useShop(); const [visible,setVisible]=useState(true);
 useEffect(()=>{const layer=layerRef.current;const frame=layer?.closest('.hero-art');if(!layer||!(frame instanceof HTMLElement))return; const apply=()=>{const r=frame.getBoundingClientRect();const pt=(p:readonly[number,number])=>[p[0]*r.width,p[1]*r.height] as const;layer.style.transform=quadMatrix(960,540,pt(SCREEN_QUAD.tl),pt(SCREEN_QUAD.tr),pt(SCREEN_QUAD.bl),pt(SCREEN_QUAD.br));}; apply();const resize=new ResizeObserver(apply);resize.observe(frame);const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));observer.observe(frame);return()=>{resize.disconnect();observer.disconnect()}},[]);
 const point=(p:readonly[number,number])=>`${p[0]*100}% ${p[1]*100}%`;
 return <div aria-hidden="true" className={'tv-clip '+(motionOff||!visible?'is-still':'')} style={{clipPath:`polygon(${point(SCREEN_QUAD.tl)},${point(SCREEN_QUAD.tr)},${point(SCREEN_QUAD.br)},${point(SCREEN_QUAD.bl)})`}}><div ref={layerRef} className="tv-layer"><div className="tv-cloud"/><div className="tv-water"/><div className="tv-light"/></div></div>
}
