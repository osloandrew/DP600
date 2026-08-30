import { describe, expect, it } from 'vitest';

import { concepts } from '@/content/concepts';
import { sources } from '@/content/sources';
import { dataTrace, getTraceStep, queryTrace } from './traces';

describe('Fabric Atlas traces', () => {
  it('moves data from a source to a report through storage and the semantic model', () => {
    expect(dataTrace).toEqual(['sources', 'onelake', 'warehouse', 'semantic-model', 'report']);
  });

  it('traces a report query backward to the answering store', () => {
    expect(queryTrace).toEqual(['report', 'semantic-model', 'warehouse']);
    expect(getTraceStep('query', 1).message).toContain('semantic model');
  });

  it('rejects impossible animation steps instead of inventing state', () => {
    expect(() => getTraceStep('data', 9)).toThrow(RangeError);
  });
});

describe('content registry integrity', () => {
  it('gives every Atlas concept valid sources and exam objectives', () => {
    Object.values(concepts).forEach((concept) => {
      expect(concept.objectiveIds.length).toBeGreaterThan(0);
      concept.sourceIds.forEach((sourceId) => expect(sources[sourceId]).toBeDefined());
      concept.relatedConceptIds.forEach((conceptId) => expect(concepts[conceptId]).toBeDefined());
    });
  });
});
