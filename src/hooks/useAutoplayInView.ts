import { useEffect, type RefObject } from 'react';

/**
 * 영상이 화면에 들어왔을 때만 재생하고 벗어나면 멈춘다.
 * "움직임 줄이기"를 켠 사용자에게는 자동 재생하지 않는다.
 */
export const useAutoplayInView = (
  videoRef: RefObject<HTMLVideoElement | null>
): void => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !reducedMotion.matches) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoRef]);
};
