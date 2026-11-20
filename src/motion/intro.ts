/**
 * 첫 화면의 막이 걷히는 순간을 다른 컴포넌트에 알린다.
 * 막이 이미 걷혔다면 등록하자마자 바로 부른다.
 */
let revealed = false;
const waiting = new Set<() => void>();

export const markIntroRevealed = (): void => {
  if (revealed) return;
  revealed = true;
  for (const callback of waiting) callback();
  waiting.clear();
};

export const onIntroRevealed = (callback: () => void): (() => void) => {
  if (revealed) {
    callback();
    return () => {};
  }
  waiting.add(callback);
  return () => waiting.delete(callback);
};
