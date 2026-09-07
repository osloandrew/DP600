import { describe, expect, it } from 'vitest';
import { examScenarios } from './exam-practice';
import { sources } from './sources';

describe('exam practice content', () => {
  it('keeps every scenario answer among its plausible alternatives', () => {
    for (const scenario of examScenarios) {
      expect(
        scenario.options.some((option) => option.id === scenario.answerId),
      ).toBe(true);
      expect(scenario.options).toHaveLength(4);
      expect(scenario.objectiveIds.length).toBeGreaterThan(0);
      expect(scenario.difficulty).toBeGreaterThanOrEqual(1);
      expect(scenario.difficulty).toBeLessThanOrEqual(4);
      expect(scenario.sourceId).toBeTruthy();
      expect(sources[scenario.sourceId]).toBeTruthy();
      expect(scenario.remediation.href.startsWith('#/lab/')).toBe(true);
    }
  });
});
