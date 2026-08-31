export type BaseMeasure = 'sales' | 'margin' | 'orders';
export type CalculationItem = 'current' | 'ytd' | 'previous-year' | 'yoy';

const values: Record<BaseMeasure, { label: string; current: number; ytd: number; previousYear: number; format: 'currency' | 'integer' }> = {
  sales: { label: 'Sales', current: 1_240_000, ytd: 8_920_000, previousYear: 1_110_000, format: 'currency' },
  margin: { label: 'Margin', current: 382_000, ytd: 2_610_000, previousYear: 344_000, format: 'currency' },
  orders: { label: 'Orders', current: 1840, ytd: 12780, previousYear: 1710, format: 'integer' },
};

export const calculationItems: Record<CalculationItem, { label: string; expression: string }> = {
  current: { label: 'Current', expression: 'SELECTEDMEASURE()' },
  ytd: { label: 'YTD', expression: "CALCULATE(SELECTEDMEASURE(), DATESYTD('Date'[Date]))" },
  'previous-year': { label: 'Previous Year', expression: "CALCULATE(SELECTEDMEASURE(), SAMEPERIODLASTYEAR('Date'[Date]))" },
  yoy: { label: 'YoY %', expression: 'DIVIDE(SELECTEDMEASURE() - [Previous Year], [Previous Year])' },
};

export function evaluateCalculationGroup(measure: BaseMeasure, item: CalculationItem) {
  const definition = values[measure];
  const value = item === 'current' ? definition.current : item === 'ytd' ? definition.ytd : item === 'previous-year' ? definition.previousYear : (definition.current - definition.previousYear) / definition.previousYear;
  const formatString = item === 'yoy' ? '0.0%;-0.0%;0.0%' : definition.format === 'currency' ? '$#,0;($#,0);$0' : '#,0';
  return { value, formatString, measureLabel: definition.label, itemLabel: calculationItems[item].label, expression: calculationItems[item].expression, numeric: typeof value === 'number' };
}

export function formatCalculationValue(measure: BaseMeasure, item: CalculationItem, value: number) {
  if (item === 'yoy') return `${(value * 100).toFixed(1)}%`;
  if (measure === 'orders') return value.toLocaleString();
  return `$${Math.round(value / 1000).toLocaleString()}K`;
}

export const repetitiveMeasureNames = ['Sales', 'Sales YTD', 'Sales PY', 'Sales YoY', 'Margin', 'Margin YTD', 'Margin PY', 'Margin YoY', 'Orders', 'Orders YTD', 'Orders PY', 'Orders YoY'];
export const calculationGroupAccuracyNote = 'Calculation items apply to explicit measures. Adding a calculation group discourages implicit measures, and model measures use the variant data type while the group exists.';
