import { useRef, useState } from 'react';
import { Check, Pause, Play } from 'lucide-react';
import { OHTANI_CORE_GOAL, OHTANI_PILLARS } from '../../data/portfolioData';
import { useAutoplayInView } from '../../hooks/useAutoplayInView';
import type { FlagshipProject } from '../../types/portfolio';
import { assetUrl } from '../../utils/assetUrl';
import { cn } from '../../utils/cn';
import { ThumbButton } from '../common/ThumbButton';
import { StudioBaseballCanvas } from '../three/StudioBaseballCanvas';

export interface MandalVisualProps {
  project: FlagshipProject;
}

const SPIN_SPEEDS = [
  { id: 'slow', label: '느리게', rpm: 0.5 },
  { id: 'normal', label: '보통', rpm: 1.4 },
  { id: 'fast', label: '빠르게', rpm: 3.2 },
];

/** 3×3 격자에서 가운데를 뺀 여덟 자리의 순서 */
const RING_POSITIONS = [0, 1, 2, 3, 5, 6, 7, 8];

export const MandalVisual = ({ project }: MandalVisualProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [view, setView] = useState<'video' | number>('video');
  const [speedId, setSpeedId] = useState<string>('normal');
  const [isPaused, setIsPaused] = useState<boolean>(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [pillarIndex, setPillarIndex] = useState<number>(6);
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(['먼저 인사하기', '쓰레기 줍기'])
  );

  useAutoplayInView(videoRef);

  const speed =
    SPIN_SPEEDS.find((item) => item.id === speedId) ?? SPIN_SPEEDS[1];
  const pillar = OHTANI_PILLARS[pillarIndex];
  const activeImage = view === 'video' ? null : project.gallery[view];
  const doneCount = pillar.actions.filter((action) =>
    checked.has(action)
  ).length;

  const toggleAction = (action: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(action)) {
        next.delete(action);
      } else {
        next.add(action);
      }
      return next;
    });
  };

  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-[#0b0c0e]">
        <div className="aspect-video">
          {/* 영상은 숨기기만 해서 보던 위치가 유지되게 한다 */}
          <video
            ref={videoRef}
            controls
            loop
            muted
            playsInline
            preload="metadata"
            poster={assetUrl('/assets/projects/hago-mandal-hero.jpg')}
            aria-label="하고-만달을 위에서 아래로 스크롤한 영상"
            className={cn(
              'h-full w-full object-cover',
              view === 'video' ? 'block' : 'hidden'
            )}
          >
            <source
              src={assetUrl('/assets/projects/hago-mandal-tour.mp4')}
              type="video/mp4"
            />
          </video>
          {activeImage ? (
            <img
              src={activeImage.src}
              alt={activeImage.caption}
              className="h-full w-full object-contain"
            />
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex gap-2.5 overflow-x-auto py-1">
          <ThumbButton
            isSelected={view === 'video'}
            onClick={() => setView('video')}
            label="스크롤 영상 보기"
          >
            <img
              src={assetUrl('/assets/projects/hago-mandal-hero.jpg')}
              alt=""
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/35">
              <Play className="h-4 w-4 fill-white text-white" />
            </span>
          </ThumbButton>
          {project.gallery.slice(1).map((item, index) => (
            <ThumbButton
              key={item.src}
              isSelected={view === index + 1}
              onClick={() => setView(index + 1)}
              label={item.caption}
            >
              <img
                src={item.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </ThumbButton>
          ))}
        </div>
        <p className="text-[0.875rem] text-ink-3">
          {activeImage
            ? activeImage.caption
            : '첫 화면부터 81칸 플래너까지 스크롤 (21초)'}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col items-center justify-between rounded-3xl bg-[#0b0c0e] px-6 py-10 lg:col-span-5">
          <StudioBaseballCanvas
            rpmSpeed={speed.rpm}
            isPaused={isPaused}
            pitchLabel={`회전 ${speed.label}`}
            className="h-[250px] w-[250px] sm:h-[300px] sm:w-[300px]"
          />

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SPIN_SPEEDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSpeedId(item.id)}
                  aria-pressed={speed.id === item.id}
                  className={cn(
                    'cursor-pointer rounded-full border px-4 py-2 text-[0.9375rem] font-semibold transition-colors',
                    speed.id === item.id
                      ? 'border-[#f4b942] bg-[#f4b942] text-[#0b0c0e]'
                      : 'border-[#3a3d44] text-[#c8cad0] hover:border-[#f4b942]'
                  )}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? '공 회전 재생' : '공 회전 멈춤'}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#3a3d44] text-[#c8cad0] transition-colors hover:border-[#f4b942]"
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-center text-[0.875rem] text-[#9a9da6]">
              이미지가 아니라 Canvas 2D로 그리는 공
            </p>
          </div>
        </div>

        <div className="flex flex-col rounded-3xl bg-surface p-5 sm:p-8 lg:col-span-7">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div>
              <p className="eyebrow">눌러 보세요</p>
              <h4 className="mt-2 text-[1.25rem] leading-snug font-bold tracking-[-0.02em]">
                오타니 원본 81칸
              </h4>
            </div>
            <p className="text-[0.9375rem] text-ink-2">
              {pillar.title} 8칸 중{' '}
              <span className="font-display text-2xl text-accent">
                {doneCount}
              </span>
              칸
            </p>
          </div>

          <div className="mt-6 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }, (_, position) => {
                if (position === 4) {
                  return (
                    <div
                      key="core"
                      className="flex min-h-[4.75rem] items-center justify-center rounded-lg bg-ink p-2 text-center text-[0.8125rem] leading-snug font-bold text-bg"
                    >
                      {OHTANI_CORE_GOAL}
                    </div>
                  );
                }

                const index = RING_POSITIONS.indexOf(position);
                const item = OHTANI_PILLARS[index];
                const isSelected = index === pillarIndex;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setPillarIndex(index)}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex min-h-[4.75rem] cursor-pointer items-center justify-center rounded-lg p-2 text-center text-[0.8125rem] leading-snug font-semibold transition-colors',
                      isSelected
                        ? 'bg-accent text-white'
                        : 'bg-bg text-ink-2 hover:text-ink'
                    )}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }, (_, position) => {
                if (position === 4) {
                  return (
                    <div
                      key="pillar"
                      className="flex min-h-[4.75rem] items-center justify-center rounded-lg bg-accent p-2 text-center text-[0.8125rem] leading-snug font-bold text-white"
                    >
                      {pillar.title}
                    </div>
                  );
                }

                const action = pillar.actions[RING_POSITIONS.indexOf(position)];
                const isDone = checked.has(action);
                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleAction(action)}
                    aria-pressed={isDone}
                    className={cn(
                      'relative flex min-h-[4.75rem] cursor-pointer items-center justify-center rounded-lg p-2 text-center text-[0.75rem] leading-snug font-medium transition-colors sm:text-[0.8125rem]',
                      isDone
                        ? 'bg-ink text-bg'
                        : 'bg-bg text-ink-2 hover:text-ink'
                    )}
                  >
                    {isDone ? (
                      <Check className="absolute top-1.5 right-1.5 h-3 w-3 opacity-70" />
                    ) : null}
                    <span>{action}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
