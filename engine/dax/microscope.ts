export type DaxScenarioId = 'sum' | 'calculate' | 'sumx' | 'all';

export type SalesRow = { id: number; category: 'Bikes' | 'Helmets' | 'Jerseys'; quantity: number; unitPrice: number; revenue: number };

export const salesRows: SalesRow[] = [
  { id: 10482, category: 'Bikes', quantity: 2, unitPrice: 600, revenue: 1200 },
  { id: 10491, category: 'Bikes', quantity: 1, unitPrice: 850, revenue: 850 },
  { id: 10503, category: 'Helmets', quantity: 3, unitPrice: 45, revenue: 135 },
  { id: 10517, category: 'Jerseys', quantity: 2, unitPrice: 80, revenue: 160 },
];

export const daxScenarios = {
  sum: { label: 'SUM', expression: 'Total Sales = SUM(FactSales[Revenue])', steps: ['Start with all visible rows', 'Read the Revenue column', 'Aggregate visible values'] },
  calculate: { label: 'CALCULATE', expression: 'Bike Sales = CALCULATE([Total Sales], DimProduct[Category] = "Bikes")', steps: ['Existing filter context', 'Add Category = Bikes', 'Propagate to FactSales', 'Evaluate [Total Sales]'] },
  sumx: { label: 'SUMX', expression: 'Extended Sales = SUMX(FactSales, FactSales[Quantity] * FactSales[Unit Price])', steps: ['Create row context', 'Evaluate row 10482', 'Evaluate row 10491', 'Evaluate row 10503', 'Evaluate row 10517'] },
  all: { label: 'ALL', expression: 'All Category Sales = CALCULATE([Total Sales], ALL(DimProduct[Category]))', steps: ['Existing filter: Bikes', 'ALL removes Category filter', 'All fact rows become visible', 'Evaluate [Total Sales]'] },
} as const;

export function evaluateDax(id: DaxScenarioId, step: number) {
  const scenario = daxScenarios[id];
  const bounded = Math.max(0, Math.min(step, scenario.steps.length - 1));
  const filterApplied = id === 'calculate' && bounded >= 1;
  const allRemoved = id === 'all' && bounded >= 1;
  const visibleRows = filterApplied || (id === 'all' && !allRemoved) ? salesRows.filter((row) => row.category === 'Bikes') : salesRows;
  const currentRow = id === 'sumx' && bounded > 0 ? salesRows[bounded - 1] : undefined;
  const accumulator = id === 'sumx' ? salesRows.slice(0, bounded).reduce((sum, row) => sum + row.quantity * row.unitPrice, 0) : visibleRows.reduce((sum, row) => sum + row.revenue, 0);
  return { step: bounded, label: scenario.steps[bounded], visibleRowIds: visibleRows.map((row) => row.id), currentRowId: currentRow?.id, currentValue: currentRow ? currentRow.quantity * currentRow.unitPrice : undefined, accumulator, resultReady: bounded === scenario.steps.length - 1, filterChips: id === 'calculate' && filterApplied ? ['Category = Bikes'] : id === 'all' && !allRemoved ? ['Category = Bikes'] : [] };
}
