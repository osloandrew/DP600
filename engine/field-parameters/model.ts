export type AxisField = 'category' | 'brand' | 'region' | 'store';
export type MeasureField = 'revenue' | 'margin' | 'orders';

const axisData: Record<AxisField, { label: string; field: string; groups: string[]; weights: number[] }> = {
  category: { label: 'Product Category', field: "'DimProduct'[Category]", groups: ['Camping', 'Outerwear', 'Packs', 'Accessories'], weights: [1, .78, .61, .42] },
  brand: { label: 'Brand', field: "'DimProduct'[Brand]", groups: ['Alpine Co', 'Northstar', 'Aurora', 'Fjell'], weights: [.88, 1, .67, .49] },
  region: { label: 'Region', field: "'DimRegion'[Region]", groups: ['Norway', 'Sweden', 'Denmark', 'Finland'], weights: [1, .82, .58, .45] },
  store: { label: 'Store', field: "'DimStore'[StoreName]", groups: ['Oslo Central', 'Stockholm City', 'Bergen Trail', 'Helsinki North'], weights: [1, .74, .53, .39] },
};

const measureData: Record<MeasureField, { label: string; field: string; base: number; format: 'currency' | 'integer' }> = {
  revenue: { label: 'Revenue', field: '[Revenue]', base: 1_240_000, format: 'currency' },
  margin: { label: 'Margin', field: '[Margin]', base: 382_000, format: 'currency' },
  orders: { label: 'Orders', field: '[Order Count]', base: 1840, format: 'integer' },
};

export function evaluateFieldParameters(axis: AxisField, measure: MeasureField) {
  const axisDefinition = axisData[axis];
  const measureDefinition = measureData[measure];
  const points = axisDefinition.groups.map((label, index) => ({ label, value: Math.round(measureDefinition.base * axisDefinition.weights[index]) }));
  const max = Math.max(...points.map((point) => point.value));
  return {
    axis: axisDefinition,
    measure: measureDefinition,
    points: points.map((point) => ({ ...point, relativeWidth: Math.round(point.value / max * 100) })),
    title: `${measureDefinition.label} by ${axisDefinition.label}`,
    explanation: `The axis parameter resolves to ${axisDefinition.field}; the values parameter resolves to the explicit ${measureDefinition.field} measure. The visual definition stays in place.`,
  };
}

export function formatParameterValue(value: number, measure: MeasureField) {
  if (measure === 'orders') return value.toLocaleString();
  return `$${(value / 1000).toFixed(0)}K`;
}

export const fieldParameterAccuracyNote = 'Conceptual report simulation. Field parameters use a calculated parameter table and NAMEOF references; implicit measures are not supported.';
