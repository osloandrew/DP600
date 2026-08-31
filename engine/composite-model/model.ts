export type DimensionMode = 'import' | 'dual';
export type CompositeQuery = 'product-slicer' | 'sales-by-product' | 'target-variance';

export const compositeTables = [
  { id: 'product', title: 'DimProduct', rows: '48K', source: 'Warehouse' },
  { id: 'date', title: 'DimDate', rows: '3.6K', source: 'Warehouse' },
  { id: 'sales', title: 'FactSales', rows: '200M', source: 'Warehouse' },
  { id: 'targets', title: 'SalesTargets', rows: '12K', source: 'Local workbook' },
] as const;

export function evaluateCompositeModel(mode: DimensionMode, query: CompositeQuery) {
  if (query === 'product-slicer') return {
    activeTables: ['product'], path: 'Model cache', relationship: 'No relationship traversal', nativeQueries: 0,
    explanation: `The slicer needs only DimProduct, so ${mode === 'dual' ? 'its Dual cache' : 'the imported table'} answers without querying the warehouse.`,
  };
  if (query === 'sales-by-product' && mode === 'dual') return {
    activeTables: ['product', 'sales'], path: 'One warehouse query', relationship: 'Regular · intra source group', nativeQueries: 1,
    explanation: 'DimProduct behaves as DirectQuery beside FactSales. Their relationship is evaluated inside the warehouse source group.',
  };
  if (query === 'sales-by-product') return {
    activeTables: ['product', 'sales'], path: 'Cache values → warehouse', relationship: 'Limited · cross source group', nativeQueries: 1,
    explanation: 'Imported product groupings must be materialized and sent to the DirectQuery source. The relationship crosses cache and warehouse source groups.',
  };
  return {
    activeTables: ['product', 'sales', 'targets'], path: 'Warehouse + model cache', relationship: 'Limited · cross source group', nativeQueries: 1,
    explanation: `SalesTargets remains imported from a local source, so comparing it with remote FactSales crosses source groups${mode === 'dual' ? '; Dual DimProduct cannot remove that targets boundary' : ''}.`,
  };
}

export const compositeAccuracyNote = 'Conceptual query-path model. Cross-source relationships are limited relationships; actual native query count and performance depend on the model and source.';
