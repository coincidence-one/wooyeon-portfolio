import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { FlagshipProject } from '../../types/portfolio';
import { cn } from '../../utils/cn';
import { EditorialLink } from '../common/EditorialLink';
import { KeyFigures } from '../common/KeyFigures';
import { SectionHeader } from '../common/SectionHeader';
import { MandalVisual } from '../work/MandalVisual';
import { OrbitsVisual } from '../work/OrbitsVisual';
import { PeachVisual } from '../work/PeachVisual';

export interface WorkSectionProps {
  projects: FlagshipProject[];
  onOpenProjectNote: (project: FlagshipProject) => void;
  onNotify: (message: string) => void;
}

export const WorkSection = ({
  projects,
  onOpenProjectNote,
  onNotify,
}: WorkSectionProps) => {
  const renderVisual = (project: FlagshipProject): ReactNode => {
    if (project.id === 'peachmarket') return <PeachVisual project={project} />;
    if (project.id === 'hago-mandal') return <MandalVisual project={project} />;
    return <OrbitsVisual project={project} onNotify={onNotify} />;
  };

  return (
    <section id="work" className="mx-auto max-w-[1200px] px-5 sm:px-8">
      <SectionHeader
        index="01"
        label="프로젝트"
        title="설계하고 운영하는 서비스"
        className="border-t border-line-strong pt-10"
      />

      {projects.map((project) => (
        <article
          key={project.id}
          id={`case-${project.id}`}
          className="mt-20 border-t border-line pt-12 first-of-type:border-t-0 sm:mt-28 sm:pt-16"
        >
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="flex items-baseline gap-3">
                <span className="font-display text-[2.5rem] leading-none text-accent italic">
                  {project.number}
                </span>
                <span className="text-[1.0625rem] font-semibold text-ink">
                  {project.title}
                </span>
                <span className="hidden text-[0.9375rem] text-ink-3 sm:inline">
                  {project.subtitle}
                </span>
              </p>
              <h3 className="mt-5 text-[clamp(1.875rem,4.2vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.04em]">
                {project.headline}
              </h3>
              <p className="mt-5 max-w-[32em] text-[1.0625rem] leading-[1.75] text-ink-2">
                {project.lede}
              </p>
            </div>

            <dl className="self-end text-[0.9375rem] lg:col-span-4">
              <MetaRow term="기간">{project.period}</MetaRow>
              <MetaRow term="역할">{project.role}</MetaRow>
              <MetaRow term="AI">{project.aiNote}</MetaRow>
              <MetaRow term="기술">{project.stack.join(', ')}</MetaRow>
              <MetaRow term="링크">
                <span className="flex flex-wrap gap-x-4 gap-y-1">
                  <EditorialLink href={project.liveUrl} external>
                    {project.liveUrl.replace('https://', '')}
                  </EditorialLink>
                  {project.appStoreUrl ? (
                    <EditorialLink href={project.appStoreUrl} external>
                      App Store
                    </EditorialLink>
                  ) : null}
                  {project.repoUrl ? (
                    <EditorialLink href={project.repoUrl} external>
                      GitHub
                    </EditorialLink>
                  ) : null}
                </span>
              </MetaRow>
            </dl>
          </div>

          <div className="reveal mt-12 sm:mt-16">{renderVisual(project)}</div>

          {project.scope ? (
            <div className="mt-16 sm:mt-20">
              <p className="eyebrow">서비스 규모</p>
              <KeyFigures figures={project.scope} className="mt-5" />
            </div>
          ) : null}

          {project.milestones ? (
            <div className="mt-16 sm:mt-20">
              <p className="eyebrow">지금까지</p>
              <ol className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-4 lg:grid-cols-7">
                {project.milestones.map((milestone) => (
                  <li
                    key={milestone.date}
                    className="border-t border-line-strong py-4"
                  >
                    <p className="font-display text-lg text-accent italic">
                      {milestone.date}
                    </p>
                    <p className="mt-1.5 text-[0.875rem] leading-[1.55] text-ink-2">
                      {milestone.label}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="mt-16 sm:mt-20">
            {project.scope ? <p className="eyebrow mb-5">최근 작업</p> : null}
            <KeyFigures figures={project.figures} />
          </div>

          <div className="mt-16 sm:mt-20">
            <ol
              className={cn(
                'grid grid-cols-1 gap-x-10 sm:grid-cols-2',
                project.stories.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              )}
            >
              {project.stories.map((story, index) => (
                <li key={story.title} className="border-t border-line py-6">
                  <p className="font-display text-xl text-accent italic">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h4 className="mt-2 text-[1.1875rem] leading-[1.35] font-bold tracking-[-0.025em]">
                    {story.title}
                  </h4>
                  <p className="mt-2 text-[0.9375rem] leading-[1.65] text-ink-2">
                    {story.summary}
                  </p>
                  {story.reference ? (
                    <p className="mt-2 text-[0.8125rem] text-ink-3">
                      {story.reference}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>

            <div className="border-t border-line pt-6">
              <button
                type="button"
                onClick={() => onOpenProjectNote(project)}
                className="group inline-flex cursor-pointer items-center gap-2 text-[0.9375rem] font-semibold text-ink hover:text-accent"
              >
                <span>{project.title} 설계 노트 보기</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

interface MetaRowProps {
  term: string;
  children: ReactNode;
}

const MetaRow = ({ term, children }: MetaRowProps) => {
  return (
    <div className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-t border-line py-3 leading-[1.6] last:border-b">
      <dt className="text-ink-3">{term}</dt>
      <dd className="text-ink-2">{children}</dd>
    </div>
  );
};
