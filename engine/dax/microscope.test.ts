import { describe, expect, it } from 'vitest';
import { evaluateDax } from './microscope';

describe('DAX microscope scenarios', () => {
  it('sums all visible revenue', () => expect(evaluateDax('sum', 2).accumulator).toBe(2345));
  it('applies a Bikes filter inside CALCULATE', () => expect(evaluateDax('calculate', 3).visibleRowIds).toEqual([10482, 10491]));
  it('removes the category filter with ALL', () => expect(evaluateDax('all', 3).visibleRowIds).toHaveLength(4));
  it('accumulates SUMX row by row', () => { expect(evaluateDax('sumx', 1).accumulator).toBe(1200); expect(evaluateDax('sumx', 4).accumulator).toBe(2345); });
});
