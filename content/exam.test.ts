import { describe, expect, it } from 'vitest';
import { exam, examObjectiveGroups } from './exam';

describe('exam coverage registry', () => {
  it('maps every current domain to objective groups', () => {
    for (const domain of exam.domains) expect(examObjectiveGroups.some((group) => group.domainId === domain.id)).toBe(true);
  });

  it('gives every built experience a route', () => {
    const built = examObjectiveGroups.flatMap((group) => group.experiences).filter((experience) => experience.state === 'built');
    expect(built.length).toBeGreaterThan(0);
    expect(built.every((experience) => Boolean(experience.href))).toBe(true);
  });
});
