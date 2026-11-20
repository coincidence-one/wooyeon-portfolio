import 'react';

declare module 'react' {
  interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    closedby?: 'any' | 'closerequest' | 'none';
  }
  interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
    loading?: 'eager' | 'lazy';
  }
}

export type FlagshipProjectId = 'peachmarket' | 'tiny-orbits' | 'hago-mandal';

export type ArchiveCategory =
  | 'all'
  | 'ai-agent'
  | 'product-saas'
  | 'interactive-native';

/** 작업 하나를 제목과 한 줄로 적는다. */
export interface WorkStory {
  title: string;
  summary: string;
  reference?: string;
}

export interface ProjectMilestone {
  date: string;
  label: string;
}

export interface ArchitectureLayer {
  name: string;
  description: string;
  stack: string[];
}

export interface ProjectGalleryItem {
  src: string;
  caption: string;
}

export interface FlagshipProject {
  id: FlagshipProjectId;
  number: string;
  /** 짧은 이름 (메뉴·검색용) */
  title: string;
  /** 한 줄 설명 (검색 키워드로도 쓴다) */
  subtitle: string;
  /** 케이스 스터디 제목 */
  headline: string;
  lede: string;
  period: string;
  role: string;
  /** AI 도구를 어떻게 썼는지 한 줄 */
  aiNote: string;
  liveUrl: string;
  appStoreUrl?: string;
  repoUrl?: string;
  stack: string[];
  /** 시간순으로 한 일. 날짜와 짧은 제목만 적는다 */
  milestones?: ProjectMilestone[];
  stories: WorkStory[];
  designNote: string;
  architectureLayers: ArchitectureLayer[];
  gallery: ProjectGalleryItem[];
}

export interface ArchiveRepoItem {
  id: string;
  name: string;
  titleKo: string;
  category: Exclude<ArchiveCategory, 'all'>;
  period: string;
  language: string;
  description: string;
  liveUrl?: string;
  githubUrl: string;
}

/** 만다라트 바깥 블록 하나: 주제와 실천 항목 8개 */
export interface MandalartPillar {
  title: string;
  actions: string[];
}
