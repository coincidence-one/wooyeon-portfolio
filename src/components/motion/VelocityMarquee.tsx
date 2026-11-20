import { Fragment, useRef } from 'react';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../../motion/gsap';
import { cn } from '../../utils/cn';

export interface VelocityMarqueeProps {
  /** 줄마다 흘러갈 낱말들. 줄은 번갈아 반대 방향으로 흐른다 */
  rows: readonly (readonly string[])[];
  className?: string;
}

/** 가만히 있을 때의 속도 (px/초) */
const BASE_SPEED = 46;
/** 화면이 넓어도 끊기지 않도록 같은 묶음을 여러 번 이어 붙인다 */
const COPIES = 4;

/**
 * 스크롤 속도에 따라 빨라지고 기울어지는 글자 띠.
 * React Bits의 ScrollVelocity와 같은 동작을 GSAP ticker로 구현했다.
 * 위로 스크롤하면 반대로 흐른다.
 */
export const VelocityMarquee = ({ rows, className }: VelocityMarqueeProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia(root);

      mm.add(MOTION_OK, () => {
        const tracks = gsap.utils
          .toArray<HTMLElement>('[data-marquee-track]', root)
          .map((track, index) => ({
            direction: index % 2 === 0 ? -1 : 1,
            position: 0,
            width: 0,
            group: track.firstElementChild as HTMLElement | null,
            setX: gsap.quickSetter(track, 'x', 'px'),
          }));
        const setSkew = gsap.quickSetter(root, 'skewX', 'deg');

        const measure = () => {
          for (const track of tracks) {
            track.width = track.group?.offsetWidth ?? 0;
          }
        };
        measure();
        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(root);

        let isInView = false;
        let lastScrollY = window.scrollY;
        let velocity = 0;

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            isInView = self.isActive;
            lastScrollY = window.scrollY;
          },
        });

        const tick = (_time: number, deltaMs: number) => {
          if (!isInView) return;
          const seconds = Math.min(deltaMs, 64) / 1000;
          const scrollY = window.scrollY;
          const rawVelocity = (scrollY - lastScrollY) / Math.max(seconds, 0.001);
          lastScrollY = scrollY;
          velocity += (rawVelocity - velocity) * 0.1;

          for (const track of tracks) {
            if (track.width === 0) continue;
            const speed = BASE_SPEED + velocity * 0.45;
            track.position += speed * track.direction * seconds;
            track.position = gsap.utils.wrap(-track.width, 0, track.position);
            track.setX(track.position);
          }
          setSkew(gsap.utils.clamp(-9, 9, velocity / -260));
        };
        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          trigger.kill();
          resizeObserver.disconnect();
        };
      });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn('overflow-x-clip py-2 select-none', className)}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={row.join('|')}
          data-marquee-track
          className={cn(
            'flex w-max will-change-transform',
            rowIndex % 2 === 1 ? 'text-outline' : 'text-ink'
          )}
        >
          {Array.from({ length: COPIES }, (_, copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {row.map((word) => (
                <Fragment key={word}>
                  <span className="px-[0.32em] text-[clamp(3rem,9.5vw,8.5rem)] leading-[1.12] font-extrabold tracking-[-0.055em] whitespace-nowrap">
                    {word}
                  </span>
                  <span className="h-[clamp(0.6rem,1.4vw,1.1rem)] w-[clamp(0.6rem,1.4vw,1.1rem)] shrink-0 rounded-full bg-accent" />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
