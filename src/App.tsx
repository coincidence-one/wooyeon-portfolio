import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { ToastBanner } from './components/common/ToastBanner';
import { CursorFollower } from './components/motion/CursorFollower';
import { IntroCurtain } from './components/motion/IntroCurtain';
import { VelocityMarquee } from './components/motion/VelocityMarquee';
import { WorldBackdrop } from './components/motion/WorldBackdrop';
import { ArchiveIndexSection } from './components/sections/ArchiveIndexSection';
import { ColophonFooter } from './components/sections/ColophonFooter';
import { CommandPaletteDialog } from './components/sections/CommandPaletteDialog';
import { HeroIntro } from './components/sections/HeroIntro';
import { ProjectDetailDialog } from './components/sections/ProjectDetailDialog';
import { TopBar } from './components/sections/TopBar';
import { WorkSection } from './components/sections/WorkSection';
import {
  ENGINEER_PROFILE,
  FLAGSHIP_PROJECTS,
  STACK_MARQUEE_ROWS,
} from './data/portfolioData';
import { useThemeScheme } from './hooks/useThemeScheme';
import { prefersReducedMotion } from './motion/gsap';
import { startSmoothScroll } from './motion/smoothScroll';
import { watchLayoutForScrollTrigger } from './motion/useScrollMotion';
import type { FlagshipProject } from './types/portfolio';

export const App = () => {
  const { resolvedScheme, toggleTheme } = useThemeScheme();
  const [modalProject, setModalProject] = useState<FlagshipProject | null>(
    null
  );
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  // Lenis 부드러운 스크롤 + 문서 높이가 바뀌면 ScrollTrigger 위치 다시 계산
  useEffect(() => {
    const stopSmoothScroll = startSmoothScroll();
    const stopWatching = pageRef.current
      ? watchLayoutForScrollTrigger(pageRef.current)
      : () => {};

    return () => {
      stopWatching();
      stopSmoothScroll();
    };
  }, []);

  // 테마 전환: 누른 자리에서 원이 퍼지며 새 테마가 드러난다 (View Transitions API).
  // 지원하지 않는 브라우저나 "움직임 줄이기"에서는 바로 바꾼다.
  const handleToggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const root = document.documentElement;
      if (
        typeof document.startViewTransition !== 'function' ||
        prefersReducedMotion()
      ) {
        toggleTheme();
        return;
      }

      const x = origin?.x ?? window.innerWidth - 48;
      const y = origin?.y ?? 32;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      root.classList.add('theme-switching');
      const transition = document.startViewTransition(() => {
        flushSync(() => toggleTheme());
      });

      void transition.ready.then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 750,
            easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
      void transition.finished.finally(() => {
        root.classList.remove('theme-switching');
      });
    },
    [toggleTheme]
  );

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2600);
  }, []);

  const handleCopyEmail = useCallback(() => {
    void navigator.clipboard
      ?.writeText(ENGINEER_PROFILE.email)
      .then(() => {
        showToast('이메일 주소를 복사했습니다');
      })
      .catch(() => {
        window.location.href = `mailto:${ENGINEER_PROFILE.email}`;
      });
  }, [showToast]);

  // ⌘K / Ctrl+K 로 빠른 이동 열기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  return (
    // 배경색을 여기에도 칠한다. isolate가 쌓임 맥락을 새로 만들어서, body의 배경은
    // 마우스 원의 색 반전(mix-blend-mode)에 섞이지 않는다.
    <div
      ref={pageRef}
      className="relative isolate min-h-screen bg-bg text-ink"
    >
      <WorldBackdrop />
      <IntroCurtain />
      <CursorFollower />
      <ScrollProgressBar />

      <TopBar
        resolvedScheme={resolvedScheme}
        onToggleTheme={handleToggleTheme}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />

      <main>
        <HeroIntro
          resolvedScheme={resolvedScheme}
          onCopyEmail={handleCopyEmail}
        />

        <VelocityMarquee rows={STACK_MARQUEE_ROWS} className="mb-20 sm:mb-28" />

        <WorkSection
          projects={FLAGSHIP_PROJECTS}
          onOpenProjectNote={(project) => setModalProject(project)}
          onNotify={showToast}
        />

        <ArchiveIndexSection />
      </main>

      <ColophonFooter onCopyEmail={handleCopyEmail} />

      <ProjectDetailDialog
        project={modalProject}
        onClose={() => setModalProject(null)}
      />

      <CommandPaletteDialog
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        projects={FLAGSHIP_PROJECTS}
        resolvedScheme={resolvedScheme}
        onToggleTheme={() => handleToggleTheme()}
        onOpenProjectNote={(project) => setModalProject(project)}
        onCopyEmail={handleCopyEmail}
      />

      <ToastBanner message={toastMessage} />
    </div>
  );
};

export default App;
