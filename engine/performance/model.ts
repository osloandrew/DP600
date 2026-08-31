export type OptimizationId = 'remove-tracking-id' | 'simplify-iterator' | 'aggregation-table' | 'single-direction' | 'category-grain' | 'reduce-interactions';

export type PerformanceMetrics = {
  durationMs: number;
  rowsScanned: number;
  modelMb: number;
  storageEngineMs: number;
  formulaEngineMs: number;
  visualMs: number;
  workRatio: number;
};

export const optimizations: { id: OptimizationId; title: string; area: 'Model' | 'DAX' | 'Relationships' | 'Visual'; description: string; consequence: string }[] = [
  { id: 'remove-tracking-id', title: 'Remove TrackingID', area: 'Model', description: 'Drop an unused, almost-unique text column.', consequence: 'Lower cardinality reduces dictionary and scan pressure.' },
  { id: 'simplify-iterator', title: 'Simplify margin iterator', area: 'DAX', description: 'Replace row-by-row SUMX work with reusable additive measures.', consequence: 'Less work remains in the formula engine.' },
  { id: 'aggregation-table', title: 'Use Sales Agg', area: 'Model', description: 'Answer category totals from an imported aggregate table.', consequence: 'The query can avoid scanning DirectQuery detail rows.' },
  { id: 'single-direction', title: 'Use single-direction filters', area: 'Relationships', description: 'Remove an unnecessary bidirectional relationship path.', consequence: 'Filter propagation becomes simpler and less ambiguous.' },
  { id: 'category-grain', title: 'Reduce visual grain', area: 'Visual', description: 'Show category instead of individual order lines.', consequence: 'The query returns fewer groups and the visual renders less detail.' },
  { id: 'reduce-interactions', title: 'Disable unused interactions', area: 'Visual', description: 'Stop three decorative visuals from cross-filtering this chart.', consequence: 'One selection triggers fewer visual queries.' },
];

export function evaluatePerformance(selected: OptimizationId[]): PerformanceMetrics {
  const has = (id: OptimizationId) => selected.includes(id);
  const storageEngineMs = 1120 - (has('remove-tracking-id') ? 160 : 0) - (has('aggregation-table') ? 720 : 0) - (has('category-grain') ? 80 : 0);
  const formulaEngineMs = 560 - (has('simplify-iterator') ? 310 : 0) - (has('single-direction') ? 90 : 0);
  const visualMs = 160 - (has('category-grain') ? 35 : 0) - (has('reduce-interactions') ? 20 : 0);
  const durationMs = storageEngineMs + formulaEngineMs + visualMs;
  return {
    durationMs,
    rowsScanned: has('aggregation-table') ? 480_000 : has('category-grain') ? 7_800_000 : 12_400_000,
    modelMb: 1240 - (has('remove-tracking-id') ? 380 : 0) + (has('aggregation-table') ? 34 : 0),
    storageEngineMs,
    formulaEngineMs,
    visualMs,
    workRatio: Number((durationMs / 1840).toFixed(2)),
  };
}

export function explainLastOptimization(id: OptimizationId | null) {
  if (!id) return 'Select an intervention and watch the affected engine metric move. Improvements combine deterministically.';
  return optimizations.find((optimization) => optimization.id === id)!.consequence;
}

export const performanceAccuracyNote = 'Simulated for learning. Values show relative consequences in this curated model; they are not measurements from a Fabric capacity or Performance Analyzer trace.';
