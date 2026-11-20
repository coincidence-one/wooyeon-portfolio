import { useRef } from 'react';
import { FINE_POINTER, gsap, MOTION_OK, useGSAP } from '../../motion/gsap';

const INTERACTIVE = 'a, button, input, label, summary, [role="button"]';

/**
 * 마우스를 따라다니는 원. 링크 위에서는 커지고,
 * data-cursor="보기"가 붙은 요소 위에서는 그 글자를 담은 큰 원이 된다.
 * 기본 커서는 그대로 두고, 마우스가 있는 기기에서만 켠다.
 */
export const CursorFollower = () => {
  // GSAP은 바깥 요소의 위치만 옮기고, 크기 변화는 안쪽 요소의 CSS가 맡는다.
  // 한 요소에서 둘을 같이 쓰면 GSAP이 CSS의 scale 값을 가져가 버린다.
  const dotAnchorRef = useRef<HTMLDivElement | null>(null);
  const labelAnchorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
      const dotAnchor = dotAnchorRef.current;
      const labelAnchor = labelAnchorRef.current;
      const dot = dotRef.current;
      const label = labelRef.current;
      if (!dotAnchor || !labelAnchor || !dot || !label) return;
      const anchors = [dotAnchor, labelAnchor];

      // 자주 바뀌는 값은 quickTo로 트윈 하나를 재사용한다 (gsap-performance)
      const dotX = gsap.quickTo(dotAnchor, 'x', {
        duration: 0.18,
        ease: 'power3',
      });
      const dotY = gsap.quickTo(dotAnchor, 'y', {
        duration: 0.18,
        ease: 'power3',
      });
      const labelX = gsap.quickTo(labelAnchor, 'x', {
        duration: 0.5,
        ease: 'power3',
      });
      const labelY = gsap.quickTo(labelAnchor, 'y', {
        duration: 0.5,
        ease: 'power3',
      });

      let shown = false;

      const handleMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        if (!shown) {
          shown = true;
          gsap.set(anchors, {
            x: event.clientX,
            y: event.clientY,
            autoAlpha: 1,
          });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        labelX(event.clientX);
        labelY(event.clientY);
      };

      const handleOver = (event: PointerEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        const labelled = target?.closest<HTMLElement>('[data-cursor]');

        if (labelled) {
          label.textContent = labelled.dataset.cursor ?? '';
          label.dataset.visible = 'true';
          dot.dataset.state = 'label';
          return;
        }

        label.dataset.visible = 'false';
        dot.dataset.state = target?.closest(INTERACTIVE) ? 'link' : 'idle';
      };

      const handleLeave = () => {
        shown = false;
        gsap.set(anchors, { autoAlpha: 0 });
      };

      window.addEventListener('pointermove', handleMove, { passive: true });
      document.addEventListener('pointerover', handleOver, { passive: true });
      document.documentElement.addEventListener('pointerleave', handleLeave);

      return () => {
        window.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerover', handleOver);
        document.documentElement.removeEventListener(
          'pointerleave',
          handleLeave
        );
      };
    });
  });

  return (
    <div aria-hidden="true">
      <div
        ref={dotAnchorRef}
        className="cursor-anchor cursor-anchor-blend invisible"
      >
        <div ref={dotRef} className="cursor-dot" data-state="idle" />
      </div>
      <div ref={labelAnchorRef} className="cursor-anchor invisible">
        <div ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
};
