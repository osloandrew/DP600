import { describe, expect, it } from 'vitest';
import { evaluateFieldParameters, formatParameterValue } from './model';

describe('field parameter explorer', () => {
  it('changes the grouping field without replacing the visual', () => {
    const category = evaluateFieldParameters('category', 'revenue');
    const region = evaluateFieldParameters('region', 'revenue');
    expect(category.axis.field).toBe("'DimProduct'[Category]");
    expect(region.points.map((point) => point.label)).toEqual(['Norway', 'Sweden', 'Denmark', 'Finland']);
    expect(region.measure.field).toBe('[Revenue]');
  });

  it('changes to an explicit measure while retaining the axis', () => {
    const result = evaluateFieldParameters('brand', 'orders');
    expect(result.axis.label).toBe('Brand');
    expect(result.measure.field).toBe('[Order Count]');
    expect(formatParameterValue(result.points[0].value, 'orders')).not.toContain('$');
  });

  it('normalizes the largest bar to the full chart width', () => {
    const result = evaluateFieldParameters('store', 'margin');
    expect(Math.max(...result.points.map((point) => point.relativeWidth))).toBe(100);
  });
});
