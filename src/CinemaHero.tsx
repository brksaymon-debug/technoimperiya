import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from './shop';
import { Icon } from './ui';

/** A short native-scroll scene, not a hijacked scrolling engine. */
export function CinemaHero() {
 const root=useRef<HTMLElement>(null);const {motionOff,setMotionOff}=useShop();
 useEffect(()=>{const el=root.current;if(!el)return;let raf=0;const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const update=()=>{raf=0;const r=el.getBoundingClientRect();const p=motionOff||media?.matches||innerWidth<769?0:Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-innerHeight)));el.style.setProperty('--scene',String(p));};
  const request=()=>{if(!raf)raf=requestAnimationFrame(update)};update();window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);media?.addEventListener('change',request);return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',request);window.removeEventListener('resize',request);media?.removeEventListener('change',request)};
 },[motionOff]);
 return <section ref={root} className="cinema-journey" aria-labelledby="cinema-title"><div className="cinema-stage"><div className="scene-aperture"><img className="scene-landscape" src="/art/immersive-landscape.webp" width="2560" height="1707" fetchPriority="high" alt="Альпийское озеро, горы и лодки — фотографическая сцена внутри витрины"/><div className="scene-shade"/><div className="scene-image-light"/></div>
 <div className="scene-topline"><span>ТЕЛЕВИЗОРЫ. И НЕ ТОЛЬКО.</span><span className="scene-display-label"><i/> ВНУТРИ ВПЕЧАТЛЕНИЙ</span></div>
 <div className="scene-intro"><p className="scene-overline">ТЕХНОИМПЕРИЯ / НОВЫЙ ВЗГЛЯД НА ТЕХНИКУ</p><h1 id="cinema-title">Больше,<br/>чем <em>экран.</em></h1><p className="scene-description">Для фильмов, от которых не оторваться.<br/>Для игр, в которые погружаешься.<br/>Для вашего дома.</p></div>
 <div className="scene-next" aria-hidden="true"><span>ПОДОЙДИТЕ БЛИЖЕ</span><p>За рамками<br/><em>привычного.</em></p></div>
 <div className="scene-actions"><Link className="button primary" to="/catalog?category=tv">Выбрать телевизор <Icon name="arrow" size={21}/></Link><Link to="/compare" className="scene-compare">Сравнить модели <span>↗</span></Link></div>
 <div className="scene-bottom"><a href="#collection" className="scene-scroll"><span className="scroll-stem"/>Листайте. Картина меняется.</a><span className="scene-availability">Витрина готовится к открытию.<br/>Пока без реальных предложений.</span><button className="scene-motion" onClick={()=>setMotionOff(!motionOff)} aria-pressed={!motionOff} aria-label={motionOff?'Включить движение витрины':'Приостановить движение витрины'}><Icon name={motionOff?'play':'pause'} size={14}/><span>Движение</span></button></div>
 </div></section>
}
