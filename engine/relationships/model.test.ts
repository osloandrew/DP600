import { describe, expect, it } from 'vitest';
import { evaluateRelationship } from './model';

describe('relationship propagation', () => {
  it('keeps peer dimensions independent with single direction', () => {
    expect(evaluateRelationship('star', 'single').activeNodes).toEqual(['product', 'sales']);
  });

  it('exposes the peer dimension with both direction', () => {
    const result = evaluateRelationship('star', 'both');
    expect(result.activeNodes).toContain('customer');
    expect(result.visibleCustomers).toBeLessThan(312);
  });

  it('routes many-to-many filters through a bridge', () => {
    expect(evaluateRelationship('bridge', 'single').activeNodes).toEqual(['promotion', 'bridge', 'product', 'sales']);
  });
});
