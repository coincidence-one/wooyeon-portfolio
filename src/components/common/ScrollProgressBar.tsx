import { useEffect, useRef } from 'react';

export const ScrollProgressBar = () => {
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('CSS' in window)) return;
    if (window.CSS.supports('animation-timeline', 'scroll()')) return;

    const handleScroll = () => {
      const el = progressRef.current;
      if (!el) return;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        el.style.transform = 'scaleX(0)';
        return;
      }
      const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
      el.style.transform = `scaleX(${ratio})`;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="portfolio-scroll-progress"
      ref={progressRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 h-0.5 w-full origin-left bg-accent"
    />
  );
};
