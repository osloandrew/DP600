import { describe, expect, it } from 'vitest';
import { activeRelationships, buildSuggestedSchema, initialSchema, moveField } from './model';

describe('Schema Lab model', () => {
  it('retains a foreign key in FactSales when extracting a dimension key', () => {
    const next = moveField(initialSchema, 'ProductID');
    expect(next.product).toContain('ProductID');
    expect(next.fact).toContain('ProductID');
  });

  it('builds four visible one-to-many relationships', () => {
    expect(activeRelationships(buildSuggestedSchema())).toHaveLength(4);
  });
});
