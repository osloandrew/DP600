import { describe, expect, it } from 'vitest';
import { evaluateCalculationGroup, formatCalculationValue, repetitiveMeasureNames } from './model';

describe('calculation group lab', () => {
  it('shows the original combinatorial measure count', () => expect(repetitiveMeasureNames).toHaveLength(12));
  it('applies YTD to the selected base measure', () => expect(evaluateCalculationGroup('margin', 'ytd').value).toBe(2610000));
  it('uses a percentage format for YoY while retaining a numeric value', () => {
    const result = evaluateCalculationGroup('sales', 'yoy');
    expect(result.numeric).toBe(true);
    expect(result.formatString).toContain('%');
    expect(formatCalculationValue('sales', 'yoy', result.value)).toBe('11.7%');
  });
  it('preserves the selected measure format for non-percentage items', () => {
    expect(evaluateCalculationGroup('orders', 'current').formatString).toBe('#,0');
    expect(evaluateCalculationGroup('sales', 'current').formatString).toContain('$');
  });
});
