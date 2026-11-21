import "@testing-library/jest-dom/vitest";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: ResizeObserverStub,
});
class IntersectionObserverStub {observe(){}unobserve(){}disconnect(){}}
Object.defineProperty(globalThis,'IntersectionObserver',{writable:true,value:IntersectionObserverStub});
if(!window.matchMedia)Object.defineProperty(window,'matchMedia',{value:()=>({matches:false,addEventListener(){},removeEventListener(){}})});
if(!globalThis.requestAnimationFrame)globalThis.requestAnimationFrame=(callback:FrameRequestCallback)=>Number(setTimeout(()=>callback(performance.now()),16));
if(!globalThis.cancelAnimationFrame)globalThis.cancelAnimationFrame=(id:number)=>clearTimeout(id);
