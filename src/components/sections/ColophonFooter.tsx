import { Copy } from 'lucide-react';
import { ENGINEER_PROFILE } from '../../data/portfolioData';
import { EditorialLink } from '../common/EditorialLink';

export interface ColophonFooterProps {
  onCopyEmail: () => void;
}

export const ColophonFooter = ({ onCopyEmail }: ColophonFooterProps) => {
  return (
    <footer id="contact" className="mt-28 bg-surface sm:mt-40">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <p className="eyebrow">연락</p>
        <h2 className="mt-4 text-[clamp(2rem,5.4vw,4.25rem)] leading-[1.12] font-bold tracking-[-0.045em]">
          이메일로 연락 주세요.
        </h2>

        <button
          type="button"
          onClick={onCopyEmail}
          aria-label={`이메일 주소 복사: ${ENGINEER_PROFILE.email}`}
          className="group mt-10 inline-flex max-w-full cursor-pointer items-center gap-4 text-left"
        >
          <span className="link-underline font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-tight break-all text-ink group-hover:text-accent group-hover:decoration-accent">
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
    </footer>
  );
};
