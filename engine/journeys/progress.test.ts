import { describe, expect, it } from 'vitest';
import { firstStopId, getStopIndex, isJourneyComplete, isLastStop, nextStopId, previousStopId } from '@/engine/journeys/progress';

const journeyId = 'from-question-to-report';

describe('journey progress', () => {
  it('finds the first stop', () => {
    expect(firstStopId(journeyId)).toBe('question-orientation');
  });

  it('advances to the next stop', () => {
    expect(nextStopId(journeyId, 'question-orientation')).toBe('choose-store');
  });

  it('returns undefined past the last stop', () => {
    expect(nextStopId(journeyId, 'diagnose-performance')).toBeUndefined();
  });

  it('steps back to the previous stop', () => {
    expect(previousStopId(journeyId, 'choose-store')).toBe('question-orientation');
  });

  it('returns undefined before the first stop', () => {
    expect(previousStopId(journeyId, 'question-orientation')).toBeUndefined();
  });

  it('identifies the last stop', () => {
    expect(isLastStop(journeyId, 'diagnose-performance')).toBe(true);
    expect(isLastStop(journeyId, 'question-orientation')).toBe(false);
  });

  it('reports completion only once every stop is completed', () => {
    expect(getStopIndex(journeyId, 'add-a-measure')).toBe(5);
    expect(isJourneyComplete(journeyId, ['question-orientation'])).toBe(false);
    expect(isJourneyComplete(journeyId, [
      'question-orientation', 'choose-store', 'clean-and-shape', 'build-star-schema',
      'model-relationships', 'add-a-measure', 'trace-the-query', 'control-access', 'diagnose-performance',
    ])).toBe(true);
  });
});
