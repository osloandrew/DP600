import { journeys, journeyStops } from '@/content/journeys';
import type { UserProgress } from '@/lib/progress';

export type SprintItem = { id: string; kind: 'foundation' | 'guided' | 'independent' | 'retrieval' | 'exam'; title: string; detail: string; duration: string; href: string };
export type SprintPlan = { daysUntilExam: number; items: SprintItem[] };

const journey = journeys['from-question-to-report'];
const dayInMs = 86_400_000;

function dayDifference(today: string, examDate: string): number {
  return Math.ceil((Date.parse(`${examDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / dayInMs);
}

export function createSprintPlan(progress: UserProgress, today: string, examDate: string): SprintPlan {
  const items: SprintItem[] = [];
  const journeyProgress = progress.journeyProgress[journey.id];
  const completedStops = journeyProgress?.completedStopIds ?? [];
  const practice = progress.journeyPractice ?? {};

  if (progress.foundationVisits.length < 3) items.push({ id: 'foundation-repair', kind: 'foundation', title: 'Foundation repair — tables, keys, and grain', detail: 'These prerequisites unlock the highest-weight Prepare-data decisions without asking you to memorize isolated terms.', duration: '15 min', href: '#/foundations' });

  const nextStopId = journeyProgress?.currentStopId ?? journey.stopIds.find((id) => !completedStops.includes(id)) ?? journey.stopIds[0];
  const nextStop = journeyStops[nextStopId];
  if (completedStops.length < journey.stopIds.length) items.push({ id: 'guided-next', kind: 'guided', title: `Guided field trip — ${nextStop.title}`, detail: `Continue Aurora’s report mission. This stop contributes to the system view before you attempt transfer practice.`, duration: '20 min', href: `#/journey/${journey.id}/${nextStopId}` });

  const independentStopId = journey.stopIds.find((id) => !practice[`${journey.id}/${id}`]?.independentComplete);
  if (independentStopId) {
    const stop = journeyStops[independentStopId];
    items.push({ id: 'independent-variation', kind: 'independent', title: `Independent variation — ${stop.title}`, detail: 'Complete the no-hint variation after the visual walkthrough so the rule transfers to a changed Aurora situation.', duration: '12 min', href: `#/journey/${journey.id}/${independentStopId}` });
  }

  if (completedStops.length > 0) items.push({ id: 'retrieval', kind: 'retrieval', title: 'Quick retrieval — identify the decisive requirement', detail: 'Return to a completed stop and explain the rule before opening its inspector or stepping the simulation.', duration: '8 min', href: `#/journey/${journey.id}/${completedStops[0]}` });

  items.push({ id: 'exam-transfer', kind: 'exam', title: 'Exam scenario set — Prepare data first', detail: 'DP-600 places the greatest weight on Prepare data. Practice applying the model after the guided work, then inspect every alternative.', duration: '20 min', href: '#/exam' });
  return { daysUntilExam: dayDifference(today, examDate), items: items.slice(0, 5) };
}
