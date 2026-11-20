import { useSyncExternalStore } from 'react';
import type { FlagshipProjectId } from '../types/portfolio';

/**
 * 스크롤 위치에 따라 페이지 전체의 색이 바뀌는 "세계".
 * <html data-world="…">에 값을 쓰고, 색은 index.css에서 그 값을 보고 정한다.
 */
export type World = 'base' | FlagshipProjectId;

let current: World = 'base';
const listeners = new Set<() => void>();

export const getWorld = (): World => current;

export const setWorld = (next: World): void => {
  if (next === current) return;
  current = next;
  if (next === 'base') {
    delete document.documentElement.dataset.world;
  } else {
    document.documentElement.dataset.world = next;
  }
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useWorld = (): World =>
  useSyncExternalStore(subscribe, getWorld, () => 'base');
