import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface KeycapProps {
  children: ReactNode;
  className?: string;
}

export const Keycap = ({ children, className }: KeycapProps) => {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium text-[var(--ink-secondary)] shadow-[0_1px_0_var(--border)]',
        className
      )}
    >
      {children}
    </kbd>
  );
};
