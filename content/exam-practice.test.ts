import { describe, expect, it } from 'vitest';
import { examScenarios } from './exam-practice';
import { sources } from './sources';

describe('exam practice content', () => {
  const skills = new Set([
    'recall',
    'interpret',
    'apply',
    'troubleshoot',
    'evaluate',
  ]);
  const scenarioTypes = new Set([
    'design',
    'security',
    'governance',
    'transformation',
    'query',
    'performance',
    'operations',
  ]);

  it('keeps every scenario answer among its plausible alternatives', () => {
    for (const scenario of examScenarios) {
      expect(
        scenario.options.some((option) => option.id === scenario.answerId),
      ).toBe(true);
      expect(scenario.options).toHaveLength(4);
      expect(scenario.objectiveIds.length).toBeGreaterThan(0);
      expect(scenario.difficulty).toBeGreaterThanOrEqual(1);
      expect(scenario.difficulty).toBeLessThanOrEqual(4);
      expect(skills.has(scenario.skill)).toBe(true);
      expect(scenario.format).toBe('single-choice');
      expect(scenarioTypes.has(scenario.scenarioType)).toBe(true);
      expect(scenario.status).toBe('verified');
      expect(scenario.verifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(scenario.sourceId).toBeTruthy();
      expect(sources[scenario.sourceId]).toBeTruthy();
      expect(scenario.remediation.href.startsWith('#')).toBe(true);
      for (const option of scenario.options) {
        expect(option.misconceptionId).toBe(
          option.id === scenario.answerId ? null : option.id,
        );
      }
    }
  });

  it('has useful coverage across difficulty and exam domains', () => {
    for (const difficulty of [1, 2, 3, 4])
      expect(
        examScenarios.filter((scenario) => scenario.difficulty === difficulty)
          .length,
      ).toBeGreaterThanOrEqual(2);

    const domainCounts = new Map<string, number>();
    for (const scenario of examScenarios)
      domainCounts.set(
        scenario.domain,
        (domainCounts.get(scenario.domain) ?? 0) + 1,
      );
    expect(domainCounts.size).toBe(3);
    for (const count of domainCounts.values())
      expect(count).toBeGreaterThanOrEqual(4);
  });
});
