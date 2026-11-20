import { useRef, type PointerEvent } from 'react';
import { GITHUB_ARCHIVE_PROJECTS } from '../../data/portfolioData';
import { EASE_OUT, gsap, prefersReducedMotion, useGSAP } from '../../motion/gsap';
import { useScrollMotion } from '../../motion/useScrollMotion';
import { EditorialLink } from '../common/EditorialLink';
import { SectionHeader } from '../common/SectionHeader';

export const ArchiveIndexSection = () => {
  const listRef = useRef<HTMLUListElement | null>(null);
  useScrollMotion(listRef);

  // 마우스가 들어온 쪽(위·아래)에서 먹색이 밀려 들어오고, 나간 쪽으로 빠진다.
  // React Bits FlowingMenu의 방향 감지 방식을 목록 행에 맞게 줄여 옮겼다.
  const { contextSafe } = useGSAP({ scope: listRef });

  const sweep = contextSafe(
    (event: PointerEvent<HTMLLIElement>, isEntering: boolean) => {
      if (event.pointerType !== 'mouse') return;
      const row = event.currentTarget;
      const fill = row.querySelector<HTMLElement>('[data-flow-fill]');
      if (!fill) return;

      const rect = row.getBoundingClientRect();
      const fromTop = event.clientY - rect.top < rect.height / 2;
      const edge = fromTop ? -101 : 101;
      const duration = prefersReducedMotion() ? 0 : 0.5;

      row.dataset.active = String(isEntering);
      if (isEntering) {
        gsap.fromTo(
          fill,
          { y: 0, yPercent: edge },
          { y: 0, yPercent: 0, duration, ease: EASE_OUT, overwrite: true }
        );
      } else {
        gsap.to(fill, {
          y: 0,
          yPercent: edge,
          duration,
          ease: EASE_OUT,
          overwrite: true,
        });
      }
    }
  );

  return (
    <section
      id="index"
      className="mx-auto mt-8 max-w-[1200px] px-5 sm:mt-12 sm:px-8"
    >
      <SectionHeader
        index="02"
        label="작은 프로젝트"
        title="그 밖에 만든 것"
        className="border-t border-line-strong pt-10"
      />

      <ul
        ref={listRef}
        data-reveal="stagger"
        className="mt-10 border-t border-line"
      >
        {GITHUB_ARCHIVE_PROJECTS.map((repo) => (
          <li
            key={repo.id}
            onPointerEnter={(event) => sweep(event, true)}
            onPointerLeave={(event) => sweep(event, false)}
            className="flow-row relative overflow-hidden border-b border-line"
          >
            <span
              data-flow-fill
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [transform:translateY(101%)] bg-ink"
            />

            <div className="relative grid grid-cols-1 gap-x-10 gap-y-2 px-0 py-6 transition-[padding] duration-500 ease-[var(--ease-out)] lg:grid-cols-12 lg:items-baseline [.flow-row[data-active='true']_&]:px-5">
              <div className="lg:col-span-4">
                <h3
                  data-flow-text
                  className="text-[1.1875rem] leading-snug font-bold tracking-[-0.02em]"
                >
                  {repo.titleKo}
                </h3>
                <p data-flow-text className="mt-1 text-sm text-ink-3">
                  {repo.name}
                </p>
              </div>

              <p
                data-flow-text
                className="text-[1rem] leading-[1.75] text-ink-2 lg:col-span-5"
              >
                {repo.description}
              </p>

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm lg:col-span-3 lg:flex-col lg:items-end lg:justify-start">
                <span data-flow-text className="text-ink-3">
                  {repo.language} · {repo.period}
                </span>
                <span className="flex gap-4 lg:mt-1">
                  {repo.liveUrl ? (
                    <EditorialLink href={repo.liveUrl} external data-flow-text>
                      열어 보기
                    </EditorialLink>
                  ) : null}
                  <EditorialLink href={repo.githubUrl} external data-flow-text>
                    GitHub
                  </EditorialLink>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
