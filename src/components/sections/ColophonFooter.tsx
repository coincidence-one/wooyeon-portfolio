import { useId, useRef } from 'react';
import { Copy } from 'lucide-react';
import { ENGINEER_PROFILE } from '../../data/portfolioData';
import {
  SIGNATURE_GLYPH_OFFSET,
  SIGNATURE_GLYPHS,
  SIGNATURE_STROKES,
  SIGNATURE_VIEW_BOX,
} from '../../data/signaturePaths';
import {
  EASE_OUT,
  gsap,
  MOTION_OK,
  SplitText,
  useGSAP,
} from '../../motion/gsap';
import { useScrollMotion } from '../../motion/useScrollMotion';
import { EditorialLink } from '../common/EditorialLink';

/** 서명 전체를 쓰는 데 걸리는 시간 (초) */
const SIGNATURE_SECONDS = 2.8;
/** 펜 자국의 너비. 글자의 가장 굵은 획을 덮을 만큼 넉넉해야 한다 */
const SIGNATURE_PEN_WIDTH = 130;

export interface ColophonFooterProps {
  onCopyEmail: () => void;
}

export const ColophonFooter = ({ onCopyEmail }: ColophonFooterProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const signatureMaskId = useId();
  useScrollMotion(rootRef);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia(root);

      mm.add(MOTION_OK, () => {
        // 맨 아래의 서명: 화면에 들어오면 펜으로 쓰듯 글자가 드러난다.
        // 실제로 긋는 것은 마스크 안의 획이고, 펜이 지나간 자리에만 글자가 보인다.
        // 획마다 길이에 비례한 시간을 줘서 펜이 일정한 속도로 움직이게 한다.
        const strokes = gsap.utils.toArray<SVGPathElement>(
          '[data-signature-stroke]',
          root
        );
        const lengths = strokes.map((stroke) => stroke.getTotalLength());
        const totalLength = lengths.reduce((sum, length) => sum + length, 0);
        const signature = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-footer-signature]',
            start: 'top 80%',
            once: true,
          },
        });
        strokes.forEach((stroke, index) => {
          signature.fromTo(
            stroke,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              duration: (lengths[index] / totalLength) * SIGNATURE_SECONDS,
              ease: 'power1.inOut',
            },
            // 펜을 떼었다 다시 대는 사이의 짧은 틈
            index === 0 ? 0 : '>0.05'
          );
        });
        // 다 쓰고 나면 마스크를 벗겨 글자 가장자리까지 온전히 보이게 한다
        signature.set('[data-signature-ink]', { attr: { mask: 'none' } });

        // 이메일 위에 마우스를 올리면 글자가 물결처럼 한 번 튄다
        const email = root.querySelector<HTMLElement>('[data-footer-email]');
        const emailText = root.querySelector<HTMLElement>(
          '[data-footer-email-text]'
        );
        if (!email || !emailText) return;

        const emailSplit = SplitText.create(emailText, {
          type: 'chars',
          charsClass: 'split-char',
        });
        const wave = gsap.to(emailSplit.chars, {
          keyframes: { y: [0, -14, 0] },
          duration: 0.55,
          ease: EASE_OUT,
          stagger: { amount: 0.35 },
          paused: true,
        });
        const playWave = () => {
          if (!wave.isActive()) wave.restart();
        };

        email.addEventListener('pointerenter', playWave);
        return () => email.removeEventListener('pointerenter', playWave);
      });
    },
    { scope: rootRef }
  );

  return (
    <footer
      ref={rootRef}
      id="contact"
      className="mt-28 overflow-hidden bg-surface sm:mt-40"
    >
      <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8 sm:pt-28">
        <p className="eyebrow">연락</p>
        <h2
          data-reveal="lines"
          className="mt-4 text-[clamp(2rem,5.4vw,4.25rem)] leading-[1.12] font-bold tracking-[-0.045em]"
        >
          이메일로 연락 주세요.
        </h2>

        <button
          type="button"
          onClick={onCopyEmail}
          data-footer-email
          data-cursor="복사"
          aria-label={`이메일 주소 복사: ${ENGINEER_PROFILE.email}`}
          className="group mt-10 inline-flex max-w-full cursor-pointer items-center gap-4 text-left"
        >
          <span
            data-footer-email-text
            className="font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-tight break-all text-ink transition-colors group-hover:text-accent"
          >
            {ENGINEER_PROFILE.email}
          </span>
          <Copy className="h-5 w-5 shrink-0 text-ink-3 group-hover:text-accent" />
        </button>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[1.0625rem]">
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

        <p className="mt-20 border-t border-line-strong pt-6 text-sm text-ink-3">
          {ENGINEER_PROFILE.nameKo} ({ENGINEER_PROFILE.nameEn})
        </p>
      </div>

      {/* 필기체 서명. 위 줄과 같은 내용이라 읽어 주지 않는다 */}
      <svg
        data-footer-signature
        aria-hidden="true"
        viewBox={SIGNATURE_VIEW_BOX}
        className="mx-auto mt-12 mb-14 block h-auto w-[min(88vw,1080px)] overflow-visible text-ink sm:mb-20"
      >
        <defs>
          <mask
            id={signatureMaskId}
            maskUnits="userSpaceOnUse"
            x="-200"
            y="-200"
            width="4600"
            height="1700"
          >
            <g
              fill="none"
              stroke="#fff"
              strokeWidth={SIGNATURE_PEN_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {SIGNATURE_STROKES.map((stroke) => (
                <path key={stroke} data-signature-stroke d={stroke} />
              ))}
            </g>
          </mask>
        </defs>
        <g data-signature-ink mask={`url(#${signatureMaskId})`}>
          <g transform={SIGNATURE_GLYPH_OFFSET} fill="currentColor">
            {SIGNATURE_GLYPHS.map((glyph, index) => (
              <path key={`${index}-${glyph.length}`} d={glyph} />
            ))}
          </g>
        </g>
      </svg>
    </footer>
  );
};
