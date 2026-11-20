import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { ArrowUpRight, Copy, Moon, Search, Sun } from 'lucide-react';
import { ENGINEER_PROFILE } from '../../data/portfolioData';
import type { ResolvedColorScheme } from '../../hooks/useThemeScheme';
import type { FlagshipProject } from '../../types/portfolio';
import { Keycap } from '../common/Keycap';
import { scrollToTarget } from '../../motion/smoothScroll';

export interface CommandPaletteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: FlagshipProject[];
  resolvedScheme: ResolvedColorScheme;
  onToggleTheme: () => void;
  onOpenProjectNote: (project: FlagshipProject) => void;
  onCopyEmail: () => void;
}

interface CommandItem {
  id: string;
  group: string;
  label: string;
  hint: string;
  keywords: string;
  onSelect: () => void;
  isExternal?: boolean;
}

export const CommandPaletteDialog = ({
  isOpen,
  onClose,
  projects,
  resolvedScheme,
  onToggleTheme,
  onOpenProjectNote,
  onCopyEmail,
}: CommandPaletteDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const listId = useId();
  const [query, setQuery] = useState<string>('');
  // 화살표 키로 고른 항목. Enter를 누르면 이 항목이 실행된다.
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      if (!dialog.open) {
        dialog.showModal();
      }
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    const handleBackdropFallback = (event: MouseEvent) => {
      if ('closedBy' in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!inside) {
        dialog.close();
      }
    };

    dialog.addEventListener('close', handleNativeClose);
    dialog.addEventListener('click', handleBackdropFallback);
    return () => {
      dialog.removeEventListener('close', handleNativeClose);
      dialog.removeEventListener('click', handleBackdropFallback);
    };
  }, [onClose]);

  const commands = useMemo<CommandItem[]>(() => {
    const runAndClose = (action: () => void) => () => {
      dialogRef.current?.close();
      action();
    };

    const projectCommands: CommandItem[] = projects.flatMap((p) => [
      {
        id: `note-${p.id}`,
        group: '설계 노트 열기',
        label: `${p.title} 설계 노트`,
        hint: 'Note',
        keywords: `${p.title} ${p.subtitle} note architecture`,
        onSelect: runAndClose(() => onOpenProjectNote(p)),
      },
      {
        id: `live-${p.id}`,
        group: '배포 사이트 열기',
        label: `${p.title} (${p.liveUrl.replace('https://', '')})`,
        hint: 'Live',
        keywords: `${p.title} live url open`,
        isExternal: true,
        onSelect: runAndClose(() => {
          window.open(p.liveUrl, '_blank', 'noopener,noreferrer');
        }),
      },
    ]);

    return [
      {
        id: 'nav-work',
        group: '페이지 이동',
        label: '프로젝트 (피치마켓 · 별마실 · 하고-만달)',
        hint: '#work',
        keywords: 'work projects 피치마켓 별마실 하고-만달 하고만달 hago mandal 만다라트 오타니 야구공',
        onSelect: runAndClose(() => {
          scrollToTarget('#work');
        }),
      },
      {
        id: 'nav-index',
        group: '페이지 이동',
        label: '작은 프로젝트',
        hint: '#index',
        keywords: 'github archive index kakao 카톡 오토체스 결제',
        onSelect: runAndClose(() => {
          scrollToTarget('#index');
        }),
      },
      ...projectCommands,
      {
        id: 'action-email',
        group: '동작',
        label: `이메일 복사 (${ENGINEER_PROFILE.email})`,
        hint: 'Copy',
        keywords: 'email mail contact copy 연락처 이메일',
        onSelect: runAndClose(onCopyEmail),
      },
      {
        id: 'action-theme',
        group: '동작',
        label:
          resolvedScheme === 'dark'
            ? '밝은 화면으로 바꾸기'
            : '어두운 화면으로 바꾸기',
        hint: 'Theme',
        keywords: 'theme dark light mode 다크 라이트 테마',
        onSelect: runAndClose(onToggleTheme),
      },
      {
        id: 'action-github',
        group: '동작',
        label: 'GitHub 프로필 열기 (coincidence-one)',
        hint: 'GitHub',
        keywords: 'github profile repo 깃허브',
        isExternal: true,
        onSelect: runAndClose(() => {
          window.open(ENGINEER_PROFILE.github, '_blank', 'noopener,noreferrer');
        }),
      },
    ];
  }, [projects, resolvedScheme, onOpenProjectNote, onCopyEmail, onToggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.keywords.toLowerCase().includes(q) ||
        cmd.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // 걸러진 결과가 줄어 고른 자리가 사라지면 마지막 항목으로 당긴다
  const safeIndex = Math.min(activeIndex, Math.max(filtered.length - 1, 0));
  const optionId = (index: number) => `${listId}-option-${index}`;

  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, safeIndex, filtered]);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // 한글을 조합하는 중의 Enter는 글자를 확정하는 키라서 건드리지 않는다
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (filtered.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((safeIndex + 1) % filtered.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((safeIndex - 1 + filtered.length) % filtered.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      filtered[safeIndex]?.onSelect();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      data-lenis-prevent
      aria-labelledby={titleId}
      className="mx-auto mt-[12vh] w-[92vw] max-w-[540px] overflow-hidden rounded-2xl border border-[var(--border-strong)] p-0 shadow-[0_30px_90px_rgb(0_0_0/0.28)]"
    >
      <h2 id={titleId} className="sr-only">
        빠른 이동 및 명령 메뉴
      </h2>

      <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={
            filtered.length > 0 ? optionId(safeIndex) : undefined
          }
          placeholder="어디로 갈까요? 프로젝트, 설계 노트, 이메일…"
          className="w-full bg-transparent text-[1rem] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none"
        />
        <Keycap>Esc</Keycap>
      </div>

      <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-[var(--ink-muted)]">
            일치하는 항목이 없습니다.
          </div>
        ) : (
          <div id={listId} role="listbox" className="space-y-1">
            {filtered.map((cmd, index) => (
              <button
                key={cmd.id}
                id={optionId(index)}
                type="button"
                role="option"
                aria-selected={index === safeIndex}
                data-active={index === safeIndex}
                onClick={cmd.onSelect}
                onPointerMove={() => setActiveIndex(index)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[0.9375rem] transition-colors data-[active=true]:bg-[var(--surface)]"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-[var(--ink)]">
                    {cmd.label}
                  </div>
                  <div className="text-xs text-[var(--ink-muted)]">
                    {cmd.group}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[var(--ink-muted)]">
                  {cmd.id === 'action-email' ? (
                    <Copy className="h-3 w-3" />
                  ) : cmd.id === 'action-theme' ? (
                    resolvedScheme === 'dark' ? (
                      <Sun className="h-3 w-3" />
                    ) : (
                      <Moon className="h-3 w-3" />
                    )
                  ) : cmd.isExternal ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : null}
                  <span>{cmd.hint}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)]/60 px-4 py-2.5 text-xs text-[var(--ink-muted)]">
        <span>↑↓ 이동 · Enter 실행</span>
        <span>⌘K 로 언제든 열 수 있습니다</span>
      </div>
    </dialog>
  );
};
