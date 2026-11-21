import { useEffect, useRef, type ReactNode } from 'react';
import { m as motion, useAnimationControls, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useShop } from './shop';
export function useSceneDepth(distance=28,placement:'entry'|'exit'='entry'){
 const ref=useRef<HTMLDivElement>(null);const visible=useInView(ref,{amount:'some',margin:'40px 0px 40px 0px'});const reduced=useReducedMotion();const {motionOff}=useShop();const still=Boolean(reduced||motionOff);const depth=useMotionValue(0);const progress=useMotionValue(0);const {scrollYProgress}=useScroll({target:ref,offset:placement==='exit'?['start start','end start']:['start end','end start']});
 const position=(value:number)=>progress.set(value);
 useMotionValueEvent(scrollYProgress,'change',progress=>{if(visible&&!still){depth.set((.5-progress)*distance);position(progress)}});
 useEffect(()=>{if(still){depth.set(0);progress.set(1)}else if(visible){depth.set((.5-scrollYProgress.get())*distance);progress.set(scrollYProgress.get())}},[still,visible,scrollYProgress,depth,distance,progress]);
 return {ref,visible,still,depth,progress};
}
const finalSurface={clipPath:'inset(-32px -24px -24px -24px)',opacity:1};
export function RevealSurface({children,visible,still}:{children:ReactNode;visible:boolean;still:boolean}){
 const controls=useAnimationControls();
 useEffect(()=>{if(still)controls.set(finalSurface);else if(visible)void controls.start(finalSurface,{duration:.65,ease:[.22,1,.36,1]});else controls.stop();return()=>controls.stop()},[controls,visible,still]);
 return <motion.div className="collection-reveal-surface" initial={still?false:{clipPath:'inset(0px 0px 22% 0px)',opacity:.7}} animate={controls} style={still?finalSurface:undefined}>{children}</motion.div>
}
// Keep the full-catalog photographic material static; animate only the bounded TV surfaces.
export function ShoppingWorld({children}:{children:ReactNode}){return <div className="holiday-shopping-world"><div className="shopping-atmosphere" aria-hidden="true"/>{children}</div>}
