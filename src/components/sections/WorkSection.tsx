import { useRef, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollTrigger, useGSAP } from '../../motion/gsap';
import { useScrollMotion } from '../../motion/useScrollMotion';
import { getWorld, setWorld } from '../../motion/world';
import type { FlagshipProject } from '../../types/portfolio';
import { cn } from '../../utils/cn';
import { EditorialLink } from '../common/EditorialLink';
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
  return (
    <section id="work">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeader
          index="01"
          label="프로젝트"
          title="설계하고 운영하는 서비스"
          className="border-t border-line-strong pt-10"
        />
      </div>

      {projects.map((project) => (
        <ProjectCase
          key={project.id}
          project={project}
          onOpenProjectNote={onOpenProjectNote}
          onNotify={onNotify}
        />
      ))}
    </section>
  );
};

interface ProjectCaseProps {
  project: FlagshipProject;
  onOpenProjectNote: (project: FlagshipProject) => void;
  onNotify: (message: string) => void;
}

/** "별마실 (Tiny Orbits)" → 큰 제목 "별마실" + 곁이름 "Tiny Orbits" */
const splitTitle = (title: string): { name: string; alias: string | null } => {
  const match = /^(.*?)\s*\((.+)\)$/.exec(title);
  return match
    ? { name: match[1], alias: match[2] }
    : { name: title, alias: null };
};

const ProjectCase = ({
  project,
  onOpenProjectNote,
  onNotify,
}: ProjectCaseProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  useScrollMotion(rootRef);

  // 이 프로젝트가 화면 가운데를 차지하는 동안 페이지 색을 이 프로젝트의 것으로 바꾼다
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 58%',
        end: 'bottom 58%',
        onToggle: (self) => {
          if (self.isActive) {
            setWorld(project.id);
          } else if (getWorld() === project.id) {
            setWorld('base');
          }
        },
      });

      return () => {
        if (getWorld() === project.id) setWorld('base');
      };
    },
    { scope: rootRef, dependencies: [project.id] }
  );

  const { name, alias } = splitTitle(project.title);

  const renderVisual = (): ReactNode => {
    if (project.id === 'peachmarket') return <PeachVisual project={project} />;
    if (project.id === 'hago-mandal') return <MandalVisual project={project} />;
    return <OrbitsVisual project={project} onNotify={onNotify} />;
  };

  return (
    <article
      ref={rootRef}
      id={`case-${project.id}`}
      className="py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <p className="flex items-baseline gap-3">
          <span className="font-display text-[2.5rem] leading-none text-accent italic">
            {project.number}
          </span>
          <span className="text-[0.9375rem] text-ink-3">
            {alias ? `${alias} · ` : ''}
            {project.subtitle}
          </span>
        </p>

        <h3
          data-reveal="chars"
          className="mt-3 text-[clamp(4rem,17vw,14rem)] leading-[0.98] font-extrabold tracking-[-0.07em]"
        >
          {name}
        </h3>

        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p
              data-reveal="lines"
              className="text-[clamp(1.5rem,3.1vw,2.5rem)] leading-[1.22] font-bold tracking-[-0.04em]"
            >
              {project.headline}
            </p>
            <p className="mt-5 max-w-[32em] text-[1.0625rem] leading-[1.75] text-ink-2">
              {project.lede}
            </p>
          </div>

          <dl
            data-reveal="stagger"
            className="self-end text-[0.9375rem] lg:col-span-4 lg:col-start-9"
          >
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

        <div className="mt-12 sm:mt-16">{renderVisual()}</div>

        {project.milestones ? (
          <div className="mt-16 sm:mt-20">
            <p className="eyebrow">지금까지</p>
            {/* 스크롤에 맞춰 왼쪽에서 오른쪽으로 그어지는 진행선 */}
            <div
              data-reveal="draw"
              aria-hidden="true"
              className="mt-5 h-0.5 origin-left bg-accent"
            />
            <ol
              data-reveal="stagger"
              className="grid grid-cols-2 gap-x-6 sm:grid-cols-4 lg:grid-cols-7"
            >
              {project.milestones.map((milestone) => (
                <li
                  key={milestone.date}
                  className="border-b border-line py-4 lg:border-b-0"
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
          <ol
            data-reveal="stagger"
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
              <span>{name} 설계 노트 보기</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </article>
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
