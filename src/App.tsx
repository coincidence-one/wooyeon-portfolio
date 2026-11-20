import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { ToastBanner } from './components/common/ToastBanner';
import { ArchiveIndexSection } from './components/sections/ArchiveIndexSection';
import { ColophonFooter } from './components/sections/ColophonFooter';
import { CommandPaletteDialog } from './components/sections/CommandPaletteDialog';
import { HeroIntro } from './components/sections/HeroIntro';
import { ProjectDetailDialog } from './components/sections/ProjectDetailDialog';
import { TopBar } from './components/sections/TopBar';
import { WorkSection } from './components/sections/WorkSection';
import { ENGINEER_PROFILE, FLAGSHIP_PROJECTS } from './data/portfolioData';
import { useThemeScheme } from './hooks/useThemeScheme';
import type { FlagshipProject } from './types/portfolio';

export const App = () => {
  const { resolvedScheme, toggleTheme } = useThemeScheme();
  const [modalProject, setModalProject] = useState<FlagshipProject | null>(
    null
  );
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

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
    <div className="min-h-screen bg-bg text-ink">
      <ScrollProgressBar />

      <TopBar
        resolvedScheme={resolvedScheme}
        onToggleTheme={toggleTheme}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />

      <main>
        <HeroIntro onCopyEmail={handleCopyEmail} />

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
        onToggleTheme={toggleTheme}
        onOpenProjectNote={(project) => setModalProject(project)}
        onCopyEmail={handleCopyEmail}
      />

      <ToastBanner message={toastMessage} />
    </div>
  );
};

export default App;
