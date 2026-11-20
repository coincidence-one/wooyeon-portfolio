import { GITHUB_ARCHIVE_PROJECTS } from '../../data/portfolioData';
import { EditorialLink } from '../common/EditorialLink';
import { SectionHeader } from '../common/SectionHeader';

export const ArchiveIndexSection = () => {
  return (
    <section
      id="index"
      className="mx-auto mt-28 max-w-[1200px] px-5 sm:mt-40 sm:px-8"
    >
      <SectionHeader
        index="02"
        label="작은 프로젝트"
        title="그 밖에 만든 것"
        className="border-t border-line-strong pt-10"
      />

      <ul className="mt-10 border-t border-line">
        {GITHUB_ARCHIVE_PROJECTS.map((repo) => (
          <li
            key={repo.id}
            className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-line py-6 lg:grid-cols-12 lg:items-baseline"
          >
            <div className="lg:col-span-4">
              <h3 className="text-[1.1875rem] leading-snug font-bold tracking-[-0.02em]">
                {repo.titleKo}
              </h3>
              <p className="mt-1 text-sm text-ink-3">{repo.name}</p>
            </div>

            <p className="text-[1rem] leading-[1.75] text-ink-2 lg:col-span-5">
              {repo.description}
            </p>

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm lg:col-span-3 lg:flex-col lg:items-end lg:justify-start">
              <span className="text-ink-3">
                {repo.language} · {repo.period}
              </span>
              <span className="flex gap-4 lg:mt-1">
                {repo.liveUrl ? (
                  <EditorialLink href={repo.liveUrl} external>
                    열어 보기
                  </EditorialLink>
                ) : null}
                <EditorialLink href={repo.githubUrl} external>
                  GitHub
                </EditorialLink>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
