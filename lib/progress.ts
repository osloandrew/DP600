const STORAGE_KEY = 'fabric-explorer-progress-v1';
export type UserProgress = { version: 1; visitedConceptIds: string[]; lastLocation: string };
const emptyProgress: UserProgress = { version: 1, visitedConceptIds: [], lastLocation: '#explore' };
export function readProgress(): UserProgress {
  if (typeof window === 'undefined') return emptyProgress;
  try { const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '') as UserProgress; return parsed.version === 1 ? parsed : emptyProgress; } catch { return emptyProgress; }
}
export function recordConceptVisit(conceptId: string): UserProgress {
  const current = readProgress();
  const next = { ...current, visitedConceptIds: Array.from(new Set([...current.visitedConceptIds, conceptId])), lastLocation: '#explore' };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
