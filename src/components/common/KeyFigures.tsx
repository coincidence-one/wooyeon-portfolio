import type { KeyFigure } from '../../types/portfolio';
import { cn } from '../../utils/cn';

export interface KeyFiguresProps {
  figures: KeyFigure[];
  size?: 'lg' | 'md';
  className?: string;
}

/** 큰 숫자를 가로로 늘어놓는다. 박스 없이 윗선 하나로만 구분한다 */
export const KeyFigures = ({
  figures,
  size = 'lg',
  className,
}: KeyFiguresProps) => {
  return (
    <dl
      className={cn(
        'grid grid-cols-2 gap-x-8 gap-y-10',
        figures.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        className
      )}
    >
      {figures.map((figure) => (
        <div
          key={figure.label}
          className="flex flex-col-reverse justify-end border-t border-line-strong pt-4"
        >
          <dt className="mt-3">
            <span className="block text-[0.9375rem] leading-snug font-semibold text-ink">
              {figure.label}
            </span>
            {figure.note ? (
              <span className="mt-1 block text-[0.8125rem] leading-snug text-ink-3">
                {figure.note}
              </span>
            ) : null}
          </dt>
          <dd
            className={cn(
              'figure-value whitespace-nowrap text-ink',
              size === 'lg'
                ? 'text-[clamp(2.4rem,4.6vw,4rem)]'
                : 'text-[clamp(2rem,3.4vw,2.75rem)]'
            )}
          >
            {figure.value}
            {figure.unit ? (
              <span className="figure-unit">{figure.unit}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
};
