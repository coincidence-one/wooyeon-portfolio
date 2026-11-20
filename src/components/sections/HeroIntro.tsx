import { lazy, Suspense, useRef } from 'react';
import { ArrowDown, Copy } from 'lucide-react';
import { ENGINEER_PROFILE } from '../../data/portfolioData';
import { useAutoplayInView } from '../../hooks/useAutoplayInView';
import type { ResolvedColorScheme } from '../../hooks/useThemeScheme';
import {
  EASE_IN_OUT,
  EASE_OUT,
  FINE_POINTER,
  gsap,
  MOTION_OK,
  SplitText,
  useGSAP,
} from '../../motion/gsap';
import { onIntroRevealed } from '../../motion/intro';
import { assetUrl } from '../../utils/assetUrl';
import { EditorialLink } from '../common/EditorialLink';
import { BrowserFrame, PhoneFrame } from '../common/Frames';
import Magnet from '../reactbits/Magnet';
import { StudioBaseballCanvas } from '../three/StudioBaseballCanvas';

// 배경 셰이더는 첫 화면 글자보다 늦게 와도 되므로 따로 받아 온다
const Threads = lazy(() => import('../reactbits/Threads'));

export interface HeroIntroProps {
  resolvedScheme: ResolvedColorScheme;
  onCopyEmail: () => void;
}

/** 배경의 실 색. WebGL은 CSS 변수를 읽지 못해 테마별 값을 직접 넘긴다 */
const THREAD_COLORS: Record<
  ResolvedColorScheme,
  { line: string; accent: string }
> = {
  light: { line: '#191713', accent: '#c9401f' },
  dark: { line: '#f0ebe1', accent: '#ff8259' },
};

export const HeroIntro = ({ resolvedScheme, onCopyEmail }: HeroIntroProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useAutoplayInView(videoRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia(root);

      mm.add(MOTION_OK, () => {
        // 막이 걷히는 순간에 맞춰 한 번만 재생하는 첫 화면 연출
        const split = SplitText.create('.hero-line', {
          type: 'chars',
          mask: 'chars',
          smartWrap: true,
          charsClass: 'split-char',
        });

        const entrance = gsap.timeline({
          paused: true,
          defaults: { ease: EASE_OUT },
        });
        entrance
          .from(split.chars, { yPercent: 118, duration: 1.25, stagger: 0.04 })
          .from(
            '[data-hero-fade]',
            { y: 26, autoAlpha: 0, duration: 1, stagger: 0.09 },
            0.45
          )
          .fromTo(
            '[data-hero-card]',
            { clipPath: 'inset(100% 0% 0% 0% round 1rem)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 1rem)',
              duration: 1.3,
              ease: EASE_IN_OUT,
              stagger: 0.12,
              clearProps: 'clipPath',
            },
            0.35
          )
          .from(
            '[data-hero-card-inner]',
            { scale: 1.22, duration: 1.7, stagger: 0.12 },
            0.35
          )
          .from('[data-hero-threads]', { autoAlpha: 0, duration: 1.8 }, 0.2);

        const stopWaiting = onIntroRevealed(() => entrance.play());

        // 스크롤하면 제목 두 줄이 서로 반대로 밀려난다
        const drift = {
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * 0.9}`,
          scrub: true,
        };
        gsap.to('.hero-line[data-drift="left"]', {
          xPercent: -7,
          ease: 'none',
          scrollTrigger: drift,
        });
        gsap.to('.hero-line[data-drift="right"]', {
          xPercent: 7,
          ease: 'none',
          scrollTrigger: drift,
        });
        gsap.to('[data-hero-phone]', {
          yPercent: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-hero-reel]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });

        return () => {
          stopWaiting();
        };
      });

      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        // 큰 카드가 마우스 쪽으로 살짝 기울고, 휴대폰은 더 많이 따라온다
        const stage = root.querySelector<HTMLElement>('[data-tilt-stage]');
        const card = root.querySelector<HTMLElement>('[data-tilt-card]');
        const phone = root.querySelector<HTMLElement>('[data-tilt-float]');
        if (!stage || !card) return;

        const options = { duration: 0.7, ease: 'power3' };
        const rotateX = gsap.quickTo(card, 'rotationX', options);
        const rotateY = gsap.quickTo(card, 'rotationY', options);
        const floatX = phone ? gsap.quickTo(phone, 'x', options) : null;
        const floatY = phone ? gsap.quickTo(phone, 'y', options) : null;

        const handleMove = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX(y * -5);
          rotateY(x * 7);
          floatX?.(x * 26);
          floatY?.(y * 18);
        };
        const handleLeave = () => {
          rotateX(0);
          rotateY(0);
          floatX?.(0);
          floatY?.(0);
        };

        stage.addEventListener('pointermove', handleMove);
        stage.addEventListener('pointerleave', handleLeave);
        return () => {
          stage.removeEventListener('pointermove', handleMove);
          stage.removeEventListener('pointerleave', handleLeave);
        };
      });
    },
    { scope: rootRef }
  );

  const threadColors = THREAD_COLORS[resolvedScheme];

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative pt-14 pb-20 sm:pt-20 sm:pb-28"
    >
      {/* React Bits Threads (WebGL). 제목 뒤에서 흐르고 마우스를 피해 갈라진다 */}
      <div
        data-hero-threads
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(100svh,58rem)] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      >
        <Suspense fallback={null}>
          <Threads
            color={threadColors.line}
            accentColor={threadColors.accent}
            opacity={resolvedScheme === 'dark' ? 0.5 : 0.42}
            brightness={1}
            lineCount={64}
            thickness={1}
            amplitude={1.5}
            distance={0.5}
            speed={0.45}
            angle={-12}
            parting={0.7}
            enableMouseInteraction
          />
        </Suspense>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <p data-hero-fade className="eyebrow">
          {ENGINEER_PROFILE.nameEn} · {ENGINEER_PROFILE.handle}
        </p>

        <h1 className="mt-6 text-[clamp(2.5rem,10.4vw,8.5rem)] leading-[1.04] font-extrabold tracking-[-0.06em]">
          <span className="hero-line block" data-drift="left">
            프론트엔드 개발자
          </span>
          <span className="hero-line block" data-drift="right">
            <span className="text-accent">{ENGINEER_PROFILE.nameKo}</span>
            입니다.
          </span>
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12 lg:items-end">
          <p
            data-hero-fade
            className="max-w-[34em] text-[1.125rem] leading-[1.8] text-ink-2 lg:col-span-7"
          >
            무엇을 어떤 구조로 만들지는 제가 주도해서 정하고, AI의 도움을
            받아 함께 다듬습니다. 구현도 AI와 나눠 하지만, 결과를 리뷰하고
            책임지는 건 제 몫입니다. 지금은 미국 조지아 한인 중고거래 앱
            피치마켓을 혼자 만들고 운영하고 있습니다.
          </p>

          <div data-hero-fade className="lg:col-span-4 lg:col-start-9">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              {/* React Bits Magnet: 가까이 가면 버튼이 마우스 쪽으로 끌려온다 */}
              <Magnet padding={56} magnetStrength={3}>
                <a
                  href="#work"
                  className="group/cta inline-flex items-center gap-2 rounded-full bg-ink py-3.5 pr-5 pl-6 text-[0.9375rem] font-semibold text-bg"
                >
                  <span>작업 보기</span>
                  <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-y-1" />
                </a>
              </Magnet>

              <button
                type="button"
                onClick={onCopyEmail}
                data-cursor="복사"
                className="link-underline inline-flex cursor-pointer items-center gap-2 text-[0.9375rem] text-ink"
              >
                <span>{ENGINEER_PROFILE.email}</span>
                <Copy className="h-3.5 w-3.5 opacity-60" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
              <EditorialLink href={ENGINEER_PROFILE.github} external>
                GitHub
              </EditorialLink>
              <EditorialLink href={ENGINEER_PROFILE.linkedin} external>
                LinkedIn
              </EditorialLink>
              <EditorialLink href={ENGINEER_PROFILE.blog} external>
                블로그
              </EditorialLink>
            </div>
          </div>
        </div>

        {/* 피치마켓을 가장 크게, 나머지 둘은 옆에 작게 둔다 */}
        <div
          data-hero-reel
          className="mt-20 grid grid-cols-1 gap-5 sm:mt-28 lg:grid-cols-12"
        >
          <a
            href="#case-peachmarket"
            data-cursor="보기"
            data-tilt-stage
            className="group flex flex-col [perspective:1400px] lg:col-span-8"
          >
            <div
              data-hero-card
              data-tilt-card
              className="relative flex-1 overflow-hidden rounded-2xl bg-[color-mix(in_srgb,#f97272_20%,var(--surface))] px-5 pt-7 will-change-transform sm:px-9 sm:pt-10 lg:min-h-[520px]"
            >
              <div data-hero-card-inner className="relative origin-top">
                <BrowserFrame url="peachmarket.app" className="lg:mr-[16%]">
                  <img
                    src={assetUrl('/assets/projects/peachmarket-live-city.jpg')}
                    alt="운영 중인 피치마켓 웹의 둘루스 중고거래 페이지"
                    className="block w-full"
                  />
                </BrowserFrame>
                <div className="absolute right-0 bottom-0 hidden w-[25%] translate-y-[22%] lg:block">
                  <div data-tilt-float>
                    <div data-hero-phone>
                      <PhoneFrame
                        eager
                        src={assetUrl(
                          '/assets/projects/peachmarket-bulk-review.png'
                        )}
                        alt="피치마켓 앱의 사진 일괄 등록 화면"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ReelCaption
              number="01"
              title="피치마켓"
              description="조지아 한인 중고거래 · 웹 · 서버 · iOS · Android"
            />
          </a>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <a
              href="#case-tiny-orbits"
              data-cursor="보기"
              className="group flex flex-col"
            >
              <div
                data-hero-card
                className="relative h-[220px] overflow-hidden rounded-2xl bg-black lg:h-auto lg:flex-1"
              >
                <video
                  ref={videoRef}
                  data-hero-card-inner
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={assetUrl('/assets/projects/tiny-orbits-og.png')}
                  aria-label="별마실 플레이 영상"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source
                    src={assetUrl('/assets/projects/tiny-orbits-launch.mp4')}
                    type="video/mp4"
                  />
                </video>
              </div>
              <ReelCaption
                number="02"
                title="별마실"
                description="멀티플레이 게임"
              />
            </a>

            <a
              href="#case-hago-mandal"
              data-cursor="보기"
              className="group flex flex-col"
            >
              <div
                data-hero-card
                className="flex h-[220px] items-center justify-center overflow-hidden rounded-2xl bg-[#0b0c0e] lg:h-auto lg:flex-1"
              >
                <div data-hero-card-inner>
                  <StudioBaseballCanvas
                    rpmSpeed={1.5}
                    className="h-[168px] w-[168px] transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
              <ReelCaption
                number="03"
                title="하고-만달"
                description="스크롤 스토리와 81칸 플래너"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ReelCaptionProps {
  number: string;
  title: string;
  description: string;
}

const ReelCaption = ({ number, title, description }: ReelCaptionProps) => {
  return (
    <p
      data-hero-fade
      className="mt-3.5 flex items-baseline gap-2.5 text-[0.9375rem] leading-snug"
    >
      <span className="font-display text-lg text-accent italic">{number}</span>
      <span className="font-semibold text-ink transition-colors group-hover:text-accent">
        {title}
      </span>
      <span className="text-ink-3">{description}</span>
    </p>
  );
};
