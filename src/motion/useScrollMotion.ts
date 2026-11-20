import type { RefObject } from 'react';
import {
  EASE_OUT,
  gsap,
  MOTION_OK,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from './gsap';

/**
 * scope 안에서 data-* 속성이 붙은 요소에 스크롤 연출을 건다.
 *
 * - data-reveal="chars"   글자 하나씩 마스크 아래에서 올라온다 (큰 제목)
 * - data-reveal="lines"   줄 단위로 마스크 아래에서 올라온다 (문장)
 * - data-reveal="stagger" 자식들이 목록 순서대로 나타난다
 * - data-reveal="expand"  스크롤에 맞춰 잘려 있던 화면이 펼쳐진다
 * - data-reveal="draw"    선이 왼쪽에서 오른쪽으로 그어진다 (스크롤 연동)
 * - data-parallax="12"    스크롤 속도와 다르게 움직인다 (값은 y 이동 %)
 *
 * 연출은 전부 gsap.matchMedia 안에 있어서 "움직임 줄이기"를 켠 사용자는
 * 처음부터 완성된 화면을 본다. 중첩된 scope에 두 번 걸지 않도록
 * 이 훅은 가장 안쪽 컴포넌트에서만 부른다.
 */
export const useScrollMotion = (
  scope: RefObject<HTMLElement | null>,
  dependencies: unknown[] = []
): void => {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const select = gsap.utils.selector(root);
      const mm = gsap.matchMedia(root);

      mm.add(MOTION_OK, () => {
        for (const element of select('[data-reveal="chars"]')) {
          const split = SplitText.create(element, {
            type: 'chars',
            mask: 'chars',
            smartWrap: true,
            charsClass: 'split-char',
          });
          gsap.from(split.chars, {
            yPercent: 118,
            duration: 1.15,
            ease: EASE_OUT,
            stagger: { amount: 0.32 },
            scrollTrigger: { trigger: element, start: 'top 90%', once: true },
          });
        }

        for (const element of select('[data-reveal="lines"]')) {
          SplitText.create(element, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 112,
                duration: 1,
                ease: EASE_OUT,
                stagger: 0.09,
                scrollTrigger: {
                  trigger: element,
                  start: 'top 90%',
                  once: true,
                },
              }),
          });
        }

        for (const element of select('[data-reveal="stagger"]')) {
          gsap.from(element.children, {
            y: 32,
            autoAlpha: 0,
            duration: 0.9,
            ease: EASE_OUT,
            stagger: { amount: 0.42 },
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
          });
        }

        for (const element of select('[data-reveal="expand"]')) {
          gsap.fromTo(
            element,
            { clipPath: 'inset(9% 8% 9% 8% round 1.5rem)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 1.5rem)',
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top 96%',
                end: 'top 32%',
                scrub: 0.6,
              },
            }
          );
          const inner = element.querySelector('[data-reveal-inner]');
          if (inner) {
            gsap.fromTo(
              inner,
              { scale: 1.16 },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: element,
                  start: 'top 96%',
                  end: 'top 32%',
                  scrub: 0.6,
                },
              }
            );
          }
        }

        for (const element of select('[data-reveal="draw"]')) {
          gsap.fromTo(
            element,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                end: 'top 48%',
                scrub: 0.5,
              },
            }
          );
        }

        for (const element of select('[data-parallax]')) {
          const amount = Number(element.dataset.parallax) || 10;
          gsap.fromTo(
            element,
            { yPercent: amount },
            {
              yPercent: -amount,
              ease: 'none',
              scrollTrigger: {
                trigger: element.parentElement ?? element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    },
    { scope, dependencies, revertOnUpdate: true }
  );
};

/**
 * 지연 로딩되는 이미지 때문에 문서 높이가 바뀌면 ScrollTrigger 위치가 어긋난다.
 * 높이가 바뀔 때만, 한 번에 모아서 다시 계산한다.
 */
export const watchLayoutForScrollTrigger = (target: HTMLElement): (() => void) => {
  let timer = 0;
  let lastHeight = target.offsetHeight;

  const observer = new ResizeObserver(() => {
    const height = target.offsetHeight;
    if (height === lastHeight) return;
    lastHeight = height;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
  });
  observer.observe(target);

  return () => {
    window.clearTimeout(timer);
    observer.disconnect();
  };
};
