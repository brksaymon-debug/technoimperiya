import { useRef, type ReactNode } from 'react';
import { useAnimate } from 'framer-motion/mini';
/** Small WAAPI-only feedback, outside ViewTransition's named heading/image surfaces. */
export function FavoriteButton({selected,label,motionOff,onToggle,children}:{selected:boolean;label:string;motionOff:boolean;onToggle:()=>void;children:ReactNode}){
 const [scope,animate]=useAnimate<HTMLButtonElement>();
 const playback=useRef<{stop:()=>void}|null>(null);
 function toggle(){
  onToggle(); // Never delay the shopping action until an animation finishes.
  playback.current?.stop();
  if(motionOff||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
  playback.current=animate(scope.current,{transform:['scale(1)','scale(0.92)','scale(1)']},{duration:0.22,ease:'easeOut'});
 }
 return <button ref={scope} data-tv-focus className={'theater-heart '+(selected?'selected':'')} aria-label={label} aria-pressed={selected} onClick={toggle}>{children}</button>
}
