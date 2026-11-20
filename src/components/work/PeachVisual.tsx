import type { FlagshipProject } from '../../types/portfolio';
import { BrowserFrame, PhoneFrame } from '../common/Frames';

export interface PeachVisualProps {
  project: FlagshipProject;
}

/** 운영 중인 화면을 크게 먼저 보여 주고, 그 아래에 사진 일괄 등록 흐름 세 장을 둔다 */
export const PeachVisual = ({ project }: PeachVisualProps) => {
  const [web, bulk, sale, liveCity, liveMobile, liveHome] = project.gallery;
  if (!web || !bulk || !sale || !liveCity || !liveMobile || !liveHome) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div
        data-reveal="expand"
        className="overflow-hidden rounded-3xl bg-[color-mix(in_srgb,#f97272_16%,var(--surface))] px-5 pt-8 sm:px-10 sm:pt-12"
      >
        <div data-reveal-inner className="relative origin-top">
          <BrowserFrame
            url="peachmarket.app/ko/marketplace/city/duluth"
            className="lg:mr-[14%]"
          >
            <img
              src={liveCity.src}
              alt={liveCity.caption}
              loading="lazy"
              className="block w-full"
            />
          </BrowserFrame>
          <div className="absolute right-0 bottom-0 hidden w-[24%] translate-y-[18%] lg:block">
            <div data-parallax="16">
              <PhoneFrame src={liveMobile.src} alt={liveMobile.caption} />
            </div>
          </div>
        </div>
      </div>

      <div data-reveal="stagger" className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <figure className="rounded-3xl bg-surface p-5 sm:p-8 lg:col-span-7">
          <BrowserFrame url="peachmarket.app/ko">
            <img
              src={liveHome.src}
              alt={liveHome.caption}
              loading="lazy"
              className="block w-full"
            />
          </BrowserFrame>
          <Caption step="1">{liveHome.caption}</Caption>
        </figure>

        <figure className="rounded-3xl bg-surface p-5 sm:p-8 lg:col-span-5">
          <BrowserFrame url="peachmarket.app">
            <img
              src={web.src}
              alt={web.caption}
              loading="lazy"
              className="block w-full"
            />
          </BrowserFrame>
          <Caption step="2">{web.caption}</Caption>
        </figure>
      </div>

      <div className="rounded-3xl bg-[color-mix(in_srgb,#f97272_16%,var(--surface))] px-5 py-8 sm:px-10 sm:py-10">
        <div
          data-reveal="stagger"
          className="mx-auto grid max-w-[720px] grid-cols-3 gap-x-5 sm:gap-x-8"
        >
          <figure>
            <PhoneFrame src={liveMobile.src} alt={liveMobile.caption} />
            <Caption step="3">{liveMobile.caption}</Caption>
          </figure>
          <figure>
            <PhoneFrame src={bulk.src} alt={bulk.caption} />
            <Caption step="4">{bulk.caption}</Caption>
          </figure>
          <figure>
            <PhoneFrame src={sale.src} alt={sale.caption} />
            <Caption step="5">{sale.caption}</Caption>
          </figure>
        </div>
      </div>
    </div>
  );
};

interface CaptionProps {
  step: string;
  children: string;
}

const Caption = ({ step, children }: CaptionProps) => {
  return (
    <figcaption className="mt-4 flex gap-2 text-[0.8125rem] leading-[1.55] text-ink-2">
      <span className="font-display text-base leading-[1.25] text-accent italic">
        {step}
      </span>
      <span>{children}</span>
    </figcaption>
  );
};
