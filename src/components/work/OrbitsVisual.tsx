import { useRef, useState } from 'react';
import { Play, Volume2 } from 'lucide-react';
import { useAutoplayInView } from '../../hooks/useAutoplayInView';
import type { FlagshipProject } from '../../types/portfolio';
import { assetUrl } from '../../utils/assetUrl';
import { cn } from '../../utils/cn';
import { ThumbButton } from '../common/ThumbButton';

export interface OrbitsVisualProps {
  project: FlagshipProject;
  onNotify: (message: string) => void;
}

interface PlanetSound {
  id: string;
  name: string;
  freqHz: number;
}

const PLANET_SOUNDS: PlanetSound[] = [
  { id: 'moon', name: '달', freqHz: 220 },
  { id: 'uranus', name: '천왕성', freqHz: 330 },
  { id: 'neptune', name: '해왕성', freqHz: 196 },
  { id: 'venus', name: '금성', freqHz: 261.6 },
];

const QUEUE_CAP = 180;

/** 같은 행성 인원에 따라 위치 전송 횟수를 줄이는 동작을 단순화한 예시 */
const tickRateFor = (people: number): number => {
  if (people > QUEUE_CAP) return 0;
  if (people <= 25) return 5;
  if (people <= 80) return 2;
  return 1;
};

export const OrbitsVisual = ({ project, onNotify }: OrbitsVisualProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [view, setView] = useState<'video' | number>('video');
  const [planetId, setPlanetId] = useState<string>('uranus');
  const [people, setPeople] = useState<number>(48);

  useAutoplayInView(videoRef);

  const activePlanet =
    PLANET_SOUNDS.find((planet) => planet.id === planetId) ?? PLANET_SOUNDS[0];
  const tickRate = tickRateFor(people);
  const activeImage = view === 'video' ? null : project.gallery[view];

  const playPlanetChord = (planet: PlanetSound) => {
    setPlanetId(planet.id);

    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) {
      onNotify('이 브라우저는 소리 합성을 지원하지 않습니다');
      return;
    }

    audioContextRef.current ??= new AudioContextClass();
    const context = audioContextRef.current;
    void context.resume();

    const now = context.currentTime;
    const root = context.createOscillator();
    const fifth = context.createOscillator();
    const gain = context.createGain();

    root.type = 'sine';
    fifth.type = 'triangle';
    root.frequency.setValueAtTime(planet.freqHz, now);
    fifth.frequency.setValueAtTime(planet.freqHz * 1.498, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    root.connect(gain);
    fifth.connect(gain);
    gain.connect(context.destination);

    root.start(now);
    fifth.start(now);
    root.stop(now + 0.72);
    fifth.stop(now + 0.72);
  };

  return (
    <div>
      <div
        data-reveal="expand"
        className="overflow-hidden rounded-3xl bg-[#0b0d1a] ring-1 ring-line"
      >
        <div className="aspect-video">
          {/* 영상은 숨기기만 해서 보던 위치가 유지되게 한다 */}
          <video
            ref={videoRef}
            controls
            loop
            muted
            playsInline
            preload="metadata"
            poster={assetUrl('/assets/projects/tiny-orbits-og.png')}
            aria-label="별마실 플레이 영상"
            className={cn(
              'h-full w-full object-cover',
              view === 'video' ? 'block' : 'hidden'
            )}
          >
            <source
              src={assetUrl('/assets/projects/tiny-orbits-tour.mp4')}
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
            label="플레이 영상 보기"
          >
            <img
              src={assetUrl('/assets/projects/tiny-orbits-og.png')}
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
            : '플레이 영상'}
        </p>
      </div>

      {/* 직접 만져 볼 수 있는 두 가지 */}
      <div
        data-reveal="stagger"
        className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-2"
      >
        <div className="border-t border-line-strong pt-5">
          <p className="eyebrow">눌러 보세요</p>
          <h4 className="mt-2 text-[1.25rem] leading-snug font-bold tracking-[-0.02em]">
            음원 파일 없이 내는 행성의 소리
          </h4>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {PLANET_SOUNDS.map((planet) => (
              <button
                key={planet.id}
                type="button"
                onClick={() => playPlanetChord(planet)}
                aria-pressed={activePlanet.id === planet.id}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-[0.9375rem] font-semibold transition-colors',
                  activePlanet.id === planet.id
                    ? 'border-ink bg-ink text-bg'
                    : 'border-line-strong text-ink-2 hover:border-ink hover:text-ink'
                )}
              >
                <Volume2 className="h-4 w-4" />
                <span>{planet.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-[0.9375rem] leading-[1.7] text-ink-2">
            {activePlanet.name} · {activePlanet.freqHz}Hz 화음을 Web Audio로
            합성
          </p>
        </div>

        <div className="border-t border-line-strong pt-5">
          <label htmlFor="orbits-people" className="eyebrow block">
            같은 행성에 모인 사람 수
          </label>
          <p className="mt-2 flex items-baseline gap-3">
            <span className="figure-value text-[3.25rem] text-ink">
              {people}
              <span className="figure-unit">명</span>
            </span>
            <span className="text-[1.0625rem] font-semibold text-accent">
              {tickRate === 0
                ? '대기열로 보내고 혼자 탐험'
                : `위치 전송 초당 ${tickRate}회`}
            </span>
          </p>
          <input
            id="orbits-people"
            type="range"
            min={1}
            max={220}
            value={people}
            onChange={(event) => setPeople(Number(event.target.value))}
            className="slider mt-3"
          />
          <p className="mt-3 text-[0.8125rem] text-ink-3">
            동작을 단순화한 예시
          </p>
        </div>
      </div>
    </div>
  );
};
