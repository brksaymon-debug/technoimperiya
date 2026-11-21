import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useAnimationControls, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useShop } from './shop';
export function useSceneDepth(distance=28){
 const ref=useRef<HTMLDivElement>(null);const visible=useInView(ref,{amount:'some',margin:'40px 0px 40px 0px'});const reduced=useReducedMotion();const {motionOff}=useShop();const still=Boolean(reduced||motionOff);const depth=useMotionValue(0);const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
 useMotionValueEvent(scrollYProgress,'change',progress=>{if(visible&&!still)depth.set((.5-progress)*distance)});
 useEffect(()=>{if(still)depth.set(0);else if(visible)depth.set((.5-scrollYProgress.get())*distance)},[still,visible,scrollYProgress,depth,distance]);
 return {ref,visible,still,depth};
}
const finalSurface={clipPath:'inset(-32px -24px -24px -24px)',opacity:1};
export function RevealSurface({children,visible,still}:{children:ReactNode;visible:boolean;still:boolean}){
 const controls=useAnimationControls();
 useEffect(()=>{if(still)controls.set(finalSurface);else if(visible)void controls.start(finalSurface,{duration:.65,ease:[.22,1,.36,1]});else controls.stop();return()=>controls.stop()},[controls,visible,still]);
 return <motion.div className="collection-reveal-surface" initial={still?false:{clipPath:'inset(0px 0px 22% 0px)',opacity:.7}} animate={controls} style={still?finalSurface:undefined}>{children}</motion.div>
}
export function ShoppingWorld({children}:{children:ReactNode}){const scene=useSceneDepth(-42);return <div ref={scene.ref} className="holiday-shopping-world"><motion.div className="shopping-atmosphere" aria-hidden="true" style={{y:scene.still?0:scene.depth,willChange:scene.visible&&!scene.still?'transform':'auto'}}/>{children}</div>}
