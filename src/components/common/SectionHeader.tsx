import { useRef, type ReactNode } from 'react';
import { useScrollMotion } from '../../motion/useScrollMotion';
import { cn } from '../../utils/cn';

export interface SectionHeaderProps {
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}

export const SectionHeader = ({
  index,
  label,
  title,
  lede,
  className,
}: SectionHeaderProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  useScrollMotion(rootRef);

  return (
    <header
      ref={rootRef}
      className={cn(
        'grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-end',
        className
      )}
    >
      <div className="lg:col-span-8">
        <p className="eyebrow flex items-baseline gap-2.5">
          <span className="font-display text-xl font-normal text-accent italic">
            {index}
          </span>
          <span>{label}</span>
        </p>
        <h2
          data-reveal="lines"
          className="mt-3 text-[clamp(2rem,4.8vw,3.75rem)] leading-[1.12] font-bold tracking-[-0.04em]"
        >
          {title}
        </h2>
      </div>
      {lede ? (
        <p className="text-[0.9375rem] leading-[1.75] text-ink-2 lg:col-span-4 lg:pb-2">
          {lede}
        </p>
      ) : null}
    </header>
  );
};
