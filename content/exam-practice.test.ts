import { describe, expect, it } from 'vitest';
import { examScenarios } from './exam-practice';

describe('exam practice content', () => {
  it('keeps every scenario answer among its plausible alternatives', () => {
    for (const scenario of examScenarios) {
      expect(scenario.options.some((option) => option.id === scenario.answerId)).toBe(true);
      expect(scenario.objectiveIds.length).toBeGreaterThan(0);
      expect(scenario.remediation.href.startsWith('#/lab/')).toBe(true);
    }
  });
});
