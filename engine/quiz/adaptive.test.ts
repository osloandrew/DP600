import { describe, expect, it } from 'vitest';
import type { ExamScenario } from '@/content/exam-practice';
import { selectAdaptiveQuestion, updateAbility } from './adaptive';

const question = (difficulty: 1 | 2 | 3 | 4) =>
  ({ id: String(difficulty), difficulty }) as ExamScenario;

describe('adaptive quiz', () => {
  it('raises ability after a correct answer and lowers it after a miss', () => {
    expect(updateAbility(2, 2, true)).toBeGreaterThan(2);
    expect(updateAbility(2, 2, false)).toBeLessThan(2);
  });

  it('selects a question nearest the current ability', () => {
    expect(
      selectAdaptiveQuestion([question(1), question(3)], 2.8, () => 0)
        ?.difficulty,
    ).toBe(3);
  });

  it('keeps ability inside the supported range', () => {
    expect(updateAbility(4, 4, true)).toBeLessThanOrEqual(4);
    expect(updateAbility(1, 1, false)).toBeGreaterThanOrEqual(1);
  });
});
