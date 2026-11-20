import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ThumbButtonProps {
  isSelected: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}

/** 영상·스크린샷을 고르는 작은 미리보기 버튼 */
export const ThumbButton = ({
  isSelected,
  onClick,
  label,
  children,
}: ThumbButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={isSelected}
      className={cn(
        'relative h-14 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-opacity',
        isSelected
          ? 'opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-bg'
          : 'opacity-55 hover:opacity-100'
      )}
    >
      {children}
    </button>
  );
};
