import { describe, expect, it } from 'vitest';
import { createSprintPlan } from './model';
import type { UserProgress } from '@/lib/progress';

const emptyProgress: UserProgress = { version: 2, visitedConceptIds: [], lastLocation: '#explore', journeyProgress: {}, foundationVisits: [] };

describe('exam sprint plan', () => {
  it('prioritizes prerequisite and guided work for a new learner', () => {
    const plan = createSprintPlan(emptyProgress, '2026-09-01', '2026-09-10');
    expect(plan.daysUntilExam).toBe(9);
    expect(plan.items.map((item) => item.kind)).toContain('foundation');
    expect(plan.items.map((item) => item.kind)).toContain('guided');
    expect(plan.items.at(-1)?.kind).toBe('exam');
  });

  it('adds retrieval only after a completed guided stop exists', () => {
    const plan = createSprintPlan({ ...emptyProgress, journeyProgress: { 'from-question-to-report': { currentStopId: 'choose-store', completedStopIds: ['question-orientation'] } } }, '2026-09-01', '2026-09-03');
    expect(plan.items.some((item) => item.kind === 'retrieval')).toBe(true);
  });
});
