import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// 플러그인은 앱에서 한 번만 등록한다 (gsap-skills: gsap-plugins, gsap-react)
gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  CustomEase,
  DrawSVGPlugin
);

/** 도착할 때 길게 감속하는 기본 곡선 */
export const EASE_OUT = CustomEase.create('portfolio-out', '0.16, 1, 0.3, 1');
/** 막이 걷히는 것처럼 양쪽이 모두 느린 곡선 */
export const EASE_IN_OUT = CustomEase.create(
  'portfolio-in-out',
  '0.76, 0, 0.24, 1'
);

/** gsap.matchMedia 조건: 움직임을 줄이지 않은 사용자에게만 연출을 건다 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };

// 개발 중 브라우저 콘솔에서 타임라인을 느리게 돌려 보거나 멈춰 볼 수 있게 한다
if (import.meta.env.DEV && typeof window !== 'undefined') {
  Object.assign(window, { gsap, ScrollTrigger });
}
