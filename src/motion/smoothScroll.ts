import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

/** 고정된 상단 바 높이만큼 덜 내려간다 */
const ANCHOR_OFFSET = -72;

export const getLenis = (): Lenis | null => lenis;

/**
 * Lenis 부드러운 스크롤을 켜고 GSAP ticker 하나로 같이 돌린다.
 * ScrollTrigger는 Lenis가 스크롤할 때마다 갱신한다.
 */
export const startSmoothScroll = (): (() => void) => {
  if (prefersReducedMotion()) return () => {};

  const instance = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    anchors: { offset: ANCHOR_OFFSET },
  });
  lenis = instance;

  instance.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => {
    instance.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    if (lenis === instance) lenis = null;
  };
};

/** 섹션으로 이동. Lenis가 꺼져 있으면 브라우저 기본 스크롤을 쓴다 */
export const scrollToTarget = (selector: string): void => {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return;

  if (lenis) {
    lenis.scrollTo(element, { offset: ANCHOR_OFFSET });
    return;
  }
  element.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
};

export const lockScroll = (): void => {
  lenis?.stop();
};

export const unlockScroll = (): void => {
  lenis?.start();
};
