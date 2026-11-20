import { useRef } from 'react';
import { ArrowDown, Copy } from 'lucide-react';
import { ENGINEER_PROFILE } from '../../data/portfolioData';
import { useAutoplayInView } from '../../hooks/useAutoplayInView';
import { assetUrl } from '../../utils/assetUrl';
import { EditorialLink } from '../common/EditorialLink';
import { BrowserFrame, PhoneFrame } from '../common/Frames';
import { StudioBaseballCanvas } from '../three/StudioBaseballCanvas';

export interface HeroIntroProps {
  onCopyEmail: () => void;
}

export const HeroIntro = ({ onCopyEmail }: HeroIntroProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useAutoplayInView(videoRef);

  return (
    <section id="top" className="pt-14 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <p className="eyebrow">
          {ENGINEER_PROFILE.nameEn} · {ENGINEER_PROFILE.handle}
        </p>

        <h1 className="mt-6 text-[clamp(2.5rem,7vw,5.75rem)] leading-[1.08] font-bold tracking-[-0.05em]">
          프론트엔드 개발자
          <br />
          <span className="text-accent">{ENGINEER_PROFILE.nameKo}</span>입니다.
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12 lg:items-end">
          <p className="max-w-[34em] text-[1.125rem] leading-[1.8] text-ink-2 lg:col-span-7">
            무엇을 어떤 구조로 만들지는 제가 주도해서 정하고, AI의 도움을
            받아 함께 다듬습니다. 구현도 AI와 나눠 하지만, 결과를 리뷰하고
            책임지는 건 제 몫입니다. 지금은 미국 조지아 한인 중고거래 앱
            피치마켓을 혼자 만들고 운영하고 있습니다.
          </p>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-ink py-3.5 pr-5 pl-6 text-[0.9375rem] font-semibold text-bg transition-transform hover:translate-y-0.5"
              >
                <span>작업 보기</span>
                <ArrowDown className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={onCopyEmail}
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
        <div className="mt-20 grid grid-cols-1 gap-5 sm:mt-28 lg:grid-cols-12">
          <a href="#case-peachmarket" className="group flex flex-col lg:col-span-8">
            <div className="relative flex-1 overflow-hidden rounded-2xl bg-[color-mix(in_srgb,#f97272_20%,var(--surface))] px-5 pt-7 sm:px-9 sm:pt-10 lg:min-h-[520px]">
              <div className="relative transition-transform duration-700 group-hover:-translate-y-2">
                <BrowserFrame
                  url="peachmarket.app"
                  className="lg:mr-[16%]"
                >
                  <img
                    src={assetUrl('/assets/projects/peachmarket-live-city.jpg')}
                    alt="운영 중인 피치마켓 웹의 둘루스 중고거래 페이지"
                    className="block w-full"
                  />
                </BrowserFrame>
                <PhoneFrame
                  eager
                  src={assetUrl('/assets/projects/peachmarket-bulk-review.png')}
                  alt="피치마켓 앱의 사진 일괄 등록 화면"
                  className="absolute right-0 bottom-0 hidden w-[25%] translate-y-[22%] lg:block"
                />
              </div>
            </div>
            <ReelCaption
              number="01"
              title="피치마켓"
              description="조지아 한인 중고거래 · 웹 · 서버 · iOS · Android"
            />
          </a>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <a href="#case-tiny-orbits" className="group flex flex-col">
              <div className="relative h-[220px] overflow-hidden rounded-2xl bg-black lg:h-auto lg:flex-1">
                <video
                  ref={videoRef}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={assetUrl('/assets/projects/tiny-orbits-og.png')}
                  aria-label="별마실 플레이 영상"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
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

            <a href="#case-hago-mandal" className="group flex flex-col">
              <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-2xl bg-[#0b0c0e] lg:h-auto lg:flex-1">
                <StudioBaseballCanvas
                  rpmSpeed={1.5}
                  className="h-[168px] w-[168px] transition-transform duration-700 group-hover:scale-110"
                />
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
    <p className="mt-3.5 flex items-baseline gap-2.5 text-[0.9375rem] leading-snug">
      <span className="font-display text-lg text-accent italic">{number}</span>
      <span className="font-semibold text-ink group-hover:text-accent">
        {title}
      </span>
      <span className="text-ink-3">{description}</span>
    </p>
  );
};
