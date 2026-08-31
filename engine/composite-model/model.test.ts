import { describe, expect, it } from 'vitest';
import { evaluateCompositeModel } from './model';

describe('composite model query routing', () => {
  it('serves a dimension-only query from cache in both modes', () => {
    expect(evaluateCompositeModel('import', 'product-slicer').nativeQueries).toBe(0);
    expect(evaluateCompositeModel('dual', 'product-slicer').path).toBe('Model cache');
  });
  it('uses a limited relationship from Import dimension to DirectQuery fact', () => expect(evaluateCompositeModel('import', 'sales-by-product').relationship).toContain('Limited'));
  it('lets a Dual dimension join its fact inside the warehouse source group', () => expect(evaluateCompositeModel('dual', 'sales-by-product')).toMatchObject({ path: 'One warehouse query', relationship: 'Regular · intra source group' }));
  it('keeps imported local targets as a cross-source query', () => expect(evaluateCompositeModel('dual', 'target-variance').relationship).toContain('cross source'));
});
