import { describe, expect, it } from 'vitest';
import { describeStorageMode, initialStorageModeState, reduceStorageMode } from './model';

describe('storage mode query paths', () => {
  it('keeps Import results stale until refresh copies the new source version', () => {
    const changed = reduceStorageMode(initialStorageModeState, { type: 'change-source' });
    expect(describeStorageMode(changed)).toMatchObject({ observedVersion: 1, cacheIsStale: true, sourceQueried: false });
    const refreshed = reduceStorageMode(changed, { type: 'refresh-cache' });
    expect(describeStorageMode(refreshed)).toMatchObject({ observedVersion: 2, cacheIsStale: false });
  });

  it('always reads the current source in DirectQuery mode', () => {
    const direct = reduceStorageMode(initialStorageModeState, { type: 'set-mode', mode: 'direct-query' });
    const changed = reduceStorageMode(direct, { type: 'change-source' });
    expect(describeStorageMode(changed)).toMatchObject({ observedVersion: 2, sourceQueried: true, nativeQuery: true });
  });

  it('switches a Dual dimension between cache and source by query context', () => {
    const dual = reduceStorageMode(initialStorageModeState, { type: 'set-mode', mode: 'dual' });
    const slicer = reduceStorageMode(dual, { type: 'set-query', query: 'product-slicer' });
    const visual = reduceStorageMode(dual, { type: 'set-query', query: 'revenue-by-category' });
    expect(describeStorageMode(slicer)).toMatchObject({ behavior: 'Dimension cache', sourceQueried: false });
    expect(describeStorageMode(visual)).toMatchObject({ behavior: 'One source query', sourceQueried: true });
  });

  it('routes Direct Lake through VertiPaq and OneLake without a native source query', () => {
    const state = reduceStorageMode(initialStorageModeState, { type: 'set-mode', mode: 'direct-lake' });
    const outcome = describeStorageMode(state);
    expect(outcome.steps.map((step) => step.id)).toEqual(['report', 'model', 'memory', 'source']);
    expect(outcome).toMatchObject({ nativeQuery: false, sourceQueried: false });
  });
});
