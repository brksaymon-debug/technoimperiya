import { useEffect } from 'react';
/** Spatial navigation augments native links/buttons; it never captures forms or dialogs. */
export function useRemoteNavigation(){useEffect(()=>{const handle=(event:KeyboardEvent)=>{
 if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)||document.querySelector('[role="dialog"]'))return;
 const target=document.activeElement as HTMLElement|null;if(target?.matches('input,select,textarea,[contenteditable="true"],[role="tab"]'))return;
 const current=target?.closest<HTMLElement>('[data-tv-focus]');if(!current&&target!==document.body)return;
 const screen=document.querySelector('.experience');if(!screen)return;const screenRect=screen.getBoundingClientRect();
 const nodes=[...screen.querySelectorAll<HTMLElement>('[data-tv-focus]')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&!el.matches(':disabled')&&getComputedStyle(el).visibility!=='hidden'});
 let next:HTMLElement|undefined;
 if(!current)next=screen.querySelector<HTMLElement>('[data-tv-default]')||nodes[0];else{const r=current.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;let best=Infinity;for(const node of nodes){if(node===current)continue;const n=node.getBoundingClientRect();const dx=n.left+n.width/2-x,dy=n.top+n.height/2-y;const horizontal=event.key==='ArrowLeft'||event.key==='ArrowRight';const main=horizontal?dx:dy;const cross=horizontal?dy:dx;const direction=event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1;if(main*direction<=8)continue;const offscreen=n.bottom<screenRect.top||n.top>screenRect.bottom;const cost=Math.abs(main)+Math.abs(cross)*3+(offscreen?80:0);if(cost<best){best=cost;next=node}}}
 if(next){event.preventDefault();next.focus({preventScroll:true});next.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});screen.classList.add('remote-mode')}
 };window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle)},[])}
