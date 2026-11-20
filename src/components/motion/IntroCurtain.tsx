import { useRef, useState } from 'react';
import { ENGINEER_PROFILE } from '../../data/portfolioData';
import {
  EASE_OUT,
  gsap,
  prefersReducedMotion,
  SplitText,
  useGSAP,
} from '../../motion/gsap';
import { markIntroRevealed } from '../../motion/intro';
import { lockScroll, unlockScroll } from '../../motion/smoothScroll';

/** 막의 아랫변이 가운데부터 늦게 따라 올라오도록 세 단계로 바꾼다 */
const CURTAIN_FULL = 'M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z';
const CURTAIN_LIFTING = 'M 0 0 L 100 0 L 100 52 Q 50 104 0 52 Z';
const CURTAIN_GONE = 'M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z';

const clearBootCurtain = () => {
  document.documentElement.classList.remove('intro-pending');
};

/**
 * 첫 화면을 여는 막. 이름이 올라왔다가 막과 함께 위로 걷힌다.
 * "움직임 줄이기"를 켠 사용자에게는 보여 주지 않는다.
 */
export const IntroCurtain = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isDone, setIsDone] = useState<boolean>(() => prefersReducedMotion());

  useGSAP(
    () => {
      clearBootCurtain();

      if (isDone) {
        markIntroRevealed();
        return;
      }

      const split = SplitText.create('[data-intro-name]', {
        type: 'chars',
        mask: 'chars',
        charsClass: 'split-char',
      });

      const timeline = gsap.timeline({
        onStart: lockScroll,
        onComplete: () => {
          unlockScroll();
          setIsDone(true);
        },
      });

      timeline
        .from(split.chars, {
          yPercent: 118,
          duration: 0.85,
          ease: EASE_OUT,
          stagger: 0.07,
        })
        .from('[data-intro-meta]', { autoAlpha: 0, duration: 0.5 }, 0.25)
        .to(
          split.chars,
          { yPercent: -118, duration: 0.5, ease: 'power3.in', stagger: 0.04 },
          '+=0.2'
        )
        .to('[data-intro-meta]', { autoAlpha: 0, duration: 0.3 }, '<')
        .to('[data-intro-path]', {
          attr: { d: CURTAIN_LIFTING },
          duration: 0.42,
          ease: 'power2.in',
        })
        // 막이 걷히기 시작할 때 첫 화면의 글자가 같이 올라오게 한다
        .add(markIntroRevealed, '<0.1')
        .to('[data-intro-path]', {
          attr: { d: CURTAIN_GONE },
          duration: 0.52,
          ease: 'power2.out',
        });

      return () => {
        unlockScroll();
      };
    },
    { scope: rootRef, dependencies: [isDone] }
  );

  if (isDone) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full fill-[light-dark(#191713,#f0ebe1)]"
      >
        <path data-intro-path d={CURTAIN_FULL} />
      </svg>

      <div className="relative flex h-full flex-col justify-between px-5 py-8 text-[light-dark(#f4f1ea,#121110)] sm:px-10 sm:py-10">
        <p data-intro-meta className="text-[0.9375rem] font-semibold">
          {ENGINEER_PROFILE.nameEn}
        </p>
        <p
          data-intro-name
          className="text-[clamp(4.5rem,19vw,16rem)] leading-none font-extrabold tracking-[-0.06em]"
        >
          {ENGINEER_PROFILE.nameKo}
        </p>
        <p data-intro-meta className="text-[0.9375rem] font-semibold">
          {ENGINEER_PROFILE.title}
        </p>
      </div>
    </div>
  );
};
