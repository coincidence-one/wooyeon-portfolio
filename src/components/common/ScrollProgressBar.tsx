import { useRef } from 'react';
import { gsap, useGSAP } from '../../motion/gsap';

/** 문서를 얼마나 읽었는지 보여 주는 맨 위의 얇은 막대. 색은 지금 프로젝트의 포인트색을 따른다 */
export const ScrollProgressBar = () => {
  const progressRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      }
    );
  });

  return (
    <div
      ref={progressRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 h-0.5 w-full origin-left [transform:scaleX(0)] bg-accent"
    />
  );
};
