import { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { FlagshipProject } from '../../types/portfolio';
import { EditorialLink } from '../common/EditorialLink';
import { cn } from '../../utils/cn';

export interface ProjectDetailDialogProps {
  project: FlagshipProject | null;
  onClose: () => void;
}

type ModalTabId = 'architecture' | 'live-preview';

let cachedSupportsDisplayTransition: boolean | undefined;

const canTransitionDisplay = (): boolean => {
  if (cachedSupportsDisplayTransition !== undefined) {
    return cachedSupportsDisplayTransition;
  }
  if (
    typeof window === 'undefined' ||
    !window.CSS?.supports?.('transition-behavior', 'allow-discrete') ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText =
    'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  void window.getComputedStyle(probe).display;
  probe.style.display = 'none';
  cachedSupportsDisplayTransition =
    window.getComputedStyle(probe).display === 'block';
  probe.remove();
  return cachedSupportsDisplayTransition;
};

const supportsTopLayerExit = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    Boolean(window.CSS?.supports?.('overlay', 'auto')) && canTransitionDisplay()
  );
};

export const ProjectDetailDialog = ({
  project,
  onClose,
}: ProjectDetailDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const [activeTab, setActiveTab] = useState<ModalTabId>('architecture');

  const closeTopLayerGracefully = async (dialog: HTMLDialogElement) => {
    if (!dialog.open) return;

    if (!supportsTopLayerExit()) {
      dialog.setAttribute('data-closing', '');
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((resolve) => window.setTimeout(resolve, 260)),
        ]);
      }
      if (!dialog.hasAttribute('data-closing')) return;
      dialog.removeAttribute('data-closing');
    }

    dialog.close();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project) {
      setActiveTab('architecture');
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      void closeTopLayerGracefully(dialog);
    }
  }, [project]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    const handleCancel = (event: Event) => {
      event.preventDefault();
      void closeTopLayerGracefully(dialog);
    };

    const handleBackdropClickFallback = (event: MouseEvent) => {
      if ('closedBy' in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;
      void closeTopLayerGracefully(dialog);
    };

    dialog.addEventListener('close', handleNativeClose);
    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleBackdropClickFallback);

    return () => {
      dialog.removeEventListener('close', handleNativeClose);
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleBackdropClickFallback);
    };
  }, [onClose]);

  const handleRequestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    void closeTopLayerGracefully(dialog);
  };

  const tabs: { id: ModalTabId; label: string }[] = [
    { id: 'architecture', label: '설계' },
    { id: 'live-preview', label: '실제 화면' },
  ];

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby={titleId}
      className="m-auto max-h-[88vh] w-[94vw] max-w-[760px] overflow-y-auto rounded-2xl border border-line-strong p-0 shadow-[0_30px_90px_rgb(0_0_0/0.28)]"
    >
      {project ? (
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 border-b border-line bg-raised/95 px-6 pt-6 backdrop-blur-md sm:px-9 sm:pt-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow flex items-baseline gap-2.5">
                  <span className="font-display text-xl font-normal text-accent italic">
                    {project.number}
                  </span>
                  <span>설계 노트</span>
                </p>
                <h2
                  id={titleId}
                  className="mt-1 text-[1.625rem] leading-tight font-bold tracking-[-0.03em]"
                >
                  {project.title}
                </h2>
              </div>

              <button
                type="button"
                autoFocus
                onClick={handleRequestClose}
                aria-label="설계 노트 닫기"
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              role="tablist"
              aria-label="설계 노트 탭"
              className="mt-5 flex gap-7 text-[0.9375rem]"
            >
              {tabs.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`note-tab-${tab.id}`}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      '-mb-px cursor-pointer border-b-2 pb-3 font-semibold transition-colors',
                      isSelected
                        ? 'border-ink text-ink'
                        : 'border-transparent text-ink-3 hover:text-ink'
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-8 sm:px-9">
            <div
              role="tabpanel"
              aria-labelledby="note-tab-architecture"
              hidden={activeTab !== 'architecture'}
            >
              <p className="text-[1.0625rem] leading-[1.85] text-ink">
                {project.designNote}
              </p>

              <div className="mt-8">
                {project.architectureLayers.map((layer) => (
                  <div key={layer.name} className="border-t border-line py-6">
                    <h3 className="text-[1.0625rem] leading-snug font-bold tracking-[-0.015em]">
                      {layer.name}
                    </h3>
                    <p className="mt-2 text-[1rem] leading-[1.8] text-ink-2">
                      {layer.description}
                    </p>
                    <p className="mt-3 text-sm text-ink-3">
                      {layer.stack.join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              role="tabpanel"
              aria-labelledby="note-tab-live-preview"
              hidden={activeTab !== 'live-preview'}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-[0.9375rem]">
                <span className="text-ink-3">
                  {project.liveUrl.replace('https://', '')}
                </span>
                <EditorialLink href={project.liveUrl} external>
                  새 탭에서 열기
                </EditorialLink>
              </div>
              {activeTab === 'live-preview' ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
                  <iframe
                    src={project.liveUrl}
                    title={`${project.title} 실제 화면`}
                    className="h-[480px] w-full border-0"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <p className="mt-3 text-sm text-ink-3">
                화면이 비어 보이면 사이트가 다른 페이지 안에 넣는 것을 막은
                경우입니다. 새 탭에서 열어 주세요.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
};
