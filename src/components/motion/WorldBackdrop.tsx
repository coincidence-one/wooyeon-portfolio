import { lazy, Suspense, useEffect, useState } from 'react';
import { useWorld } from '../../motion/world';

// 별 셰이더는 첫 화면에 필요 없으므로 따로 받아 온다
const Galaxy = lazy(() => import('../reactbits/Galaxy'));

/** 첫 화면 연출이 끝난 뒤 한가할 때 별 셰이더를 미리 준비한다 (ms) */
const GALAXY_WARMUP_DELAY = 3000;

/**
 * 프로젝트 세계마다 화면 뒤에 깔리는 고정 배경.
 * 어느 층을 보일지는 <html data-world>를 보고 CSS가 정한다.
 */
export const WorldBackdrop = () => {
  const world = useWorld();
  const [isGalaxyMounted, setIsGalaxyMounted] = useState<boolean>(false);

  const isOrbits = world === 'tiny-orbits';
  if (isOrbits && !isGalaxyMounted) {
    setIsGalaxyMounted(true);
  }

  // 셰이더 컴파일은 메인 스레드를 잠깐 멈춘다. 별마실 구간에 들어서는 순간에 하면
  // 색 전환과 겹쳐 끊기므로, 그 전에 화면 밖에서 미리 해 둔다.
  useEffect(() => {
    const timer = window.setTimeout(
      () => setIsGalaxyMounted(true),
      GALAXY_WARMUP_DELAY
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        data-layer="peachmarket"
        className="world-layer absolute inset-0 bg-[radial-gradient(60%_55%_at_88%_8%,rgb(249_114_114/0.3),transparent_70%),radial-gradient(45%_45%_at_4%_92%,rgb(255_176_122/0.26),transparent_70%)]"
      />

      <div data-layer="tiny-orbits" className="world-layer absolute inset-0">
        {isGalaxyMounted ? (
          <Suspense fallback={null}>
            {/* 화면의 모든 픽셀에서 별을 계산하는 셰이더라 부하가 픽셀 수와 별 겹 수에 비례한다.
                4K 화면에서 원래 설정(레티나 해상도, 4겹, 마우스 밀어내기)은 한 프레임에 16ms를 넘겼다.
                별은 원래 번진 점이라 낮은 해상도로 그려 늘려도 티가 덜 나므로
                해상도를 0.75배로 묶고, 겹을 2개로 줄이고, 마우스 밀어내기와 등장 워프를 껐다.
                같은 화면에서 약 4ms. 보이지 않는 동안에는 멈춘다 */}
            <Galaxy
              transparent
              dpr={0.75}
              layers={2}
              density={1.35}
              starSpeed={0.28}
              rotationSpeed={0.025}
              glowIntensity={0.36}
              twinkleIntensity={0.55}
              starColors={['#ffffff', '#b9c8ff', '#ffd9a0']}
              mouseRepulsion={false}
              intro={false}
              disableAnimation={!isOrbits}
            />
          </Suspense>
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_110%,rgb(64_92_220/0.32),transparent_70%)]" />
      </div>

      <div
        data-layer="hago-mandal"
        className="world-layer absolute inset-0 bg-[radial-gradient(55%_48%_at_50%_-6%,rgb(244_185_66/0.2),transparent_72%)]"
      />
    </div>
  );
};
