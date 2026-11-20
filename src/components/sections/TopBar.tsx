import { Moon, Search, Sun } from 'lucide-react';
import { ENGINEER_PROFILE } from '../../data/portfolioData';
import type { ResolvedColorScheme } from '../../hooks/useThemeScheme';

export interface TopBarProps {
  resolvedScheme: ResolvedColorScheme;
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
}

const NAV_ITEMS = [
  { href: '#work', label: '프로젝트' },
  { href: '#index', label: '작은 프로젝트' },
  { href: '#contact', label: '연락' },
];

export const TopBar = ({
  resolvedScheme,
  onToggleTheme,
  onOpenCommandPalette,
}: TopBarProps) => {
  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-baseline gap-2.5">
          <span className="text-[1.0625rem] font-bold tracking-[-0.02em] text-ink">
            {ENGINEER_PROFILE.nameKo}
          </span>
          <span className="hidden text-sm text-ink-3 sm:inline">
            {ENGINEER_PROFILE.title}
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            aria-label="섹션 이동"
            className="mr-3 hidden items-center gap-7 text-[0.9375rem] text-ink-2 md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="빠른 이동 열기 (⌘K)"
            title="빠른 이동 (⌘K)"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface hover:text-ink"
          >
            <Search className="h-[1.125rem] w-[1.125rem]" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              resolvedScheme === 'dark'
                ? '밝은 화면으로 바꾸기'
                : '어두운 화면으로 바꾸기'
            }
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface hover:text-ink"
          >
            {resolvedScheme === 'dark' ? (
              <Sun className="h-[1.125rem] w-[1.125rem]" />
            ) : (
              <Moon className="h-[1.125rem] w-[1.125rem]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
