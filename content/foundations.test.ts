import { describe, expect, it } from 'vitest';
import { foundationModules, foundationOrder, foundations } from './foundations';

describe('foundation registry', () => {
  it('gives every foundation concept a valid module', () => {
    const moduleIds = foundationModules.map((mod) => mod.id);
    for (const id of foundationOrder) expect(moduleIds).toContain(foundations[id].moduleId);
  });

  it('keeps every entry concise and complete', () => {
    for (const id of foundationOrder) {
      const concept = foundations[id];
      expect(concept.id).toBe(id);
      expect(concept.plainMeaning.length).toBeGreaterThan(0);
      expect(concept.auroraExample.length).toBeGreaterThan(0);
      expect(concept.whyItMattersLater.length).toBeGreaterThan(0);
      expect(concept.relatedLabs.length).toBeGreaterThan(0);
      expect(concept.check.prompt.length).toBeGreaterThan(0);
      expect(concept.check.reveal.length).toBeGreaterThan(0);
    }
  });

  it('points every related lab at a hash route', () => {
    for (const id of foundationOrder) {
      for (const lab of foundations[id].relatedLabs) expect(lab.href.startsWith('#')).toBe(true);
    }
  });

  it('has at least one concept per module', () => {
    for (const mod of foundationModules) {
      expect(foundationOrder.some((id) => foundations[id].moduleId === mod.id)).toBe(true);
    }
  });

  it('gives several concepts a reality-orientation note', () => {
    const withRealityNote = foundationOrder.filter((id) => (foundations[id].realityNote?.length ?? 0) > 0);
    expect(withRealityNote.length).toBeGreaterThanOrEqual(5);
  });
});
