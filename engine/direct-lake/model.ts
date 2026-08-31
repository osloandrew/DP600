export type DirectLakeMode = 'onelake' | 'sql-endpoint';
export type DirectLakeQuery = 'sales-by-category' | 'sales-by-region';

export const directLakeColumns = [
  { id: 'FactSales.Revenue', table: 'FactSales', label: 'Revenue' },
  { id: 'FactSales.ProductKey', table: 'FactSales', label: 'ProductKey' },
  { id: 'FactSales.RegionKey', table: 'FactSales', label: 'RegionKey' },
  { id: 'DimProduct.ProductKey', table: 'DimProduct', label: 'ProductKey' },
  { id: 'DimProduct.Category', table: 'DimProduct', label: 'Category' },
  { id: 'DimRegion.RegionKey', table: 'DimRegion', label: 'RegionKey' },
  { id: 'DimRegion.Region', table: 'DimRegion', label: 'Region' },
] as const;

export type DirectLakeColumnId = (typeof directLakeColumns)[number]['id'];

const queryColumns: Record<DirectLakeQuery, DirectLakeColumnId[]> = {
  'sales-by-category': ['FactSales.Revenue', 'FactSales.ProductKey', 'DimProduct.ProductKey', 'DimProduct.Category'],
  'sales-by-region': ['FactSales.Revenue', 'FactSales.RegionKey', 'DimRegion.RegionKey', 'DimRegion.Region'],
};

export type DirectLakeState = {
  mode: DirectLakeMode;
  loadedColumns: DirectLakeColumnId[];
  newlyLoadedColumns: DirectLakeColumnId[];
  dataVersion: number;
  framedVersion: number;
  lastQuery?: DirectLakeQuery;
  fallbackCondition: boolean;
  servingPath: 'idle' | 'direct-lake' | 'direct-query';
};

export type DirectLakeAction =
  | { type: 'set-mode'; mode: DirectLakeMode }
  | { type: 'run-query'; query: DirectLakeQuery }
  | { type: 'change-data' }
  | { type: 'refresh-frame' }
  | { type: 'toggle-fallback-condition' }
  | { type: 'reset' };

export const initialDirectLakeState: DirectLakeState = {
  mode: 'onelake', loadedColumns: [], newlyLoadedColumns: [], dataVersion: 1,
  framedVersion: 1, fallbackCondition: false, servingPath: 'idle',
};

export function reduceDirectLake(state: DirectLakeState, action: DirectLakeAction): DirectLakeState {
  if (action.type === 'reset') return { ...initialDirectLakeState, mode: state.mode };
  if (action.type === 'set-mode') return { ...initialDirectLakeState, mode: action.mode };
  if (action.type === 'change-data') {
    return { ...state, dataVersion: state.dataVersion + 1, newlyLoadedColumns: [], servingPath: 'idle' };
  }
  if (action.type === 'refresh-frame') {
    return {
      ...state,
      framedVersion: state.dataVersion,
      loadedColumns: state.loadedColumns.filter((column) => !column.startsWith('FactSales.')),
      newlyLoadedColumns: [],
      servingPath: 'idle',
    };
  }
  if (action.type === 'toggle-fallback-condition') {
    if (state.mode === 'onelake') return state;
    return { ...state, fallbackCondition: !state.fallbackCondition, newlyLoadedColumns: [], servingPath: 'idle' };
  }

  const fallsBack = state.mode === 'sql-endpoint' && state.fallbackCondition;
  const required = queryColumns[action.query];
  const newlyLoadedColumns = fallsBack ? [] : required.filter((column) => !state.loadedColumns.includes(column));
  return {
    ...state,
    lastQuery: action.query,
    newlyLoadedColumns,
    loadedColumns: fallsBack ? state.loadedColumns : Array.from(new Set([...state.loadedColumns, ...required])),
    servingPath: fallsBack ? 'direct-query' : 'direct-lake',
  };
}

export function describeDirectLake(state: DirectLakeState) {
  if (state.servingPath === 'direct-query') return 'The query bypassed the in-memory Direct Lake path and was sent to the SQL analytics endpoint.';
  if (state.servingPath === 'direct-lake' && state.newlyLoadedColumns.length === 0) return 'Every required column was already in memory, so the query reused the column cache.';
  if (state.servingPath === 'direct-lake') return `${state.newlyLoadedColumns.length} required columns were loaded from Delta/Parquet into memory.`;
  if (state.dataVersion !== state.framedVersion) return 'The Delta tables changed, but this model still points to the previous framed table state.';
  if (state.fallbackCondition) return 'SQL row-level security is present. The next query will use DirectQuery fallback.';
  return 'Run a query to see which columns the semantic model needs.';
}
