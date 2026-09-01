const STORAGE_KEY = 'fabric-explorer-progress-v2';
export type JourneyProgress = { currentStopId: string; completedStopIds: string[] };
export type JourneyPracticeProgress = { workedExample: boolean; guidedComplete: boolean; independentComplete: boolean };
export type UserProgress = {
  version: 2;
  visitedConceptIds: string[];
  lastLocation: string;
  journeyProgress: Record<string, JourneyProgress>;
  journeyPractice?: Record<string, JourneyPracticeProgress>;
  foundationVisits: string[];
};
const emptyProgress: UserProgress = { version: 2, visitedConceptIds: [], lastLocation: '#explore', journeyProgress: {}, foundationVisits: [] };

export function readProgress(): UserProgress {
  if (typeof window === 'undefined') return emptyProgress;
  try { const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '') as UserProgress; return parsed.version === 2 ? parsed : emptyProgress; } catch { return emptyProgress; }
}

function writeProgress(next: UserProgress): UserProgress {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function recordConceptVisit(conceptId: string): UserProgress {
  const current = readProgress();
  return writeProgress({ ...current, visitedConceptIds: Array.from(new Set([...current.visitedConceptIds, conceptId])), lastLocation: '#explore' });
}

export function recordFoundationVisit(foundationId: string): UserProgress {
  const current = readProgress();
  return writeProgress({ ...current, foundationVisits: Array.from(new Set([...current.foundationVisits, foundationId])) });
}

export function readJourneyProgress(journeyId: string): JourneyProgress | undefined {
  return readProgress().journeyProgress[journeyId];
}

export function recordJourneyStop(journeyId: string, stopId: string, completed: boolean): UserProgress {
  const current = readProgress();
  const existing = current.journeyProgress[journeyId];
  const completedStopIds = completed && existing ? Array.from(new Set([...existing.completedStopIds, stopId])) : (existing?.completedStopIds ?? []);
  return writeProgress({
    ...current,
    journeyProgress: { ...current.journeyProgress, [journeyId]: { currentStopId: stopId, completedStopIds } },
    lastLocation: `#/journey/${journeyId}/${stopId}`,
  });
}

export function readJourneyPractice(journeyId: string, stopId: string): JourneyPracticeProgress {
  return readProgress().journeyPractice?.[`${journeyId}/${stopId}`] ?? { workedExample: false, guidedComplete: false, independentComplete: false };
}

export function recordJourneyPractice(
  journeyId: string,
  stopId: string,
  step: keyof JourneyPracticeProgress,
): UserProgress {
  const current = readProgress();
  const key = `${journeyId}/${stopId}`;
  const existing = current.journeyPractice?.[key] ?? { workedExample: false, guidedComplete: false, independentComplete: false };
  return writeProgress({
    ...current,
    journeyPractice: { ...current.journeyPractice, [key]: { ...existing, [step]: true } },
  });
}
