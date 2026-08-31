export type StorageMode = 'import' | 'direct-query' | 'dual' | 'direct-lake';
export type StorageQuery = 'product-slicer' | 'revenue-by-category';

export type StorageModeState = {
  mode: StorageMode;
  query: StorageQuery;
  sourceVersion: number;
  cacheVersion: number;
  runCount: number;
};

export type StorageModeAction =
  | { type: 'set-mode'; mode: StorageMode }
  | { type: 'set-query'; query: StorageQuery }
  | { type: 'change-source' }
  | { type: 'refresh-cache' }
  | { type: 'run-query' }
  | { type: 'reset' };

export const initialStorageModeState: StorageModeState = {
  mode: 'import',
  query: 'revenue-by-category',
  sourceVersion: 1,
  cacheVersion: 1,
  runCount: 0,
};

export function reduceStorageMode(state: StorageModeState, action: StorageModeAction): StorageModeState {
  switch (action.type) {
    case 'set-mode': return { ...state, mode: action.mode, runCount: 0 };
    case 'set-query': return { ...state, query: action.query, runCount: 0 };
    case 'change-source': return { ...state, sourceVersion: state.sourceVersion + 1, runCount: 0 };
    case 'refresh-cache': return state.mode === 'import' || state.mode === 'dual'
      ? { ...state, cacheVersion: state.sourceVersion, runCount: 0 }
      : state;
    case 'run-query': return { ...state, runCount: state.runCount + 1 };
    case 'reset': return initialStorageModeState;
  }
}

export type PathStep = { id: 'report' | 'model' | 'memory' | 'source'; eyebrow: string; title: string; detail: string };

export function describeStorageMode(state: StorageModeState) {
  const isDimensionOnly = state.query === 'product-slicer';
  const cacheIsStale = state.cacheVersion < state.sourceVersion;

  if (state.mode === 'import') return {
    title: 'Import serves the copied model data',
    behavior: 'In-memory only',
    observedVersion: state.cacheVersion,
    cacheIsStale,
    sourceQueried: false,
    nativeQuery: false,
    refreshAvailable: cacheIsStale,
    explanation: cacheIsStale
      ? `The source is at v${state.sourceVersion}, but this query still sees imported v${state.cacheVersion}. Refresh copies current source data into the model.`
      : 'The visual is answered by compressed data already imported into the semantic model. The source is not queried at report time.',
    steps: [
      { id: 'report', eyebrow: 'Request', title: isDimensionOnly ? 'Product slicer' : 'Revenue by category', detail: 'A report visual issues a DAX query.' },
      { id: 'model', eyebrow: 'Semantic model', title: 'Import tables', detail: 'Relationships and measures shape the request.' },
      { id: 'memory', eyebrow: 'VertiPaq', title: `Imported data · v${state.cacheVersion}`, detail: 'Compressed model data answers the query.' },
    ] as PathStep[],
  };

  if (state.mode === 'direct-query') return {
    title: 'DirectQuery sends the request to the source',
    behavior: 'Source on every query',
    observedVersion: state.sourceVersion,
    cacheIsStale: false,
    sourceQueried: true,
    nativeQuery: true,
    refreshAvailable: false,
    explanation: `The model holds metadata, not imported table data. The report request becomes a native source query and returns source v${state.sourceVersion}.`,
    steps: [
      { id: 'report', eyebrow: 'Request', title: isDimensionOnly ? 'Product slicer' : 'Revenue by category', detail: 'A report visual issues a DAX query.' },
      { id: 'model', eyebrow: 'Semantic model', title: 'DirectQuery metadata', detail: 'The model translates the request.' },
      { id: 'source', eyebrow: 'Source', title: `Warehouse tables · v${state.sourceVersion}`, detail: 'A native query runs at report time.' },
    ] as PathStep[],
  };

  if (state.mode === 'dual') {
    const useCache = isDimensionOnly;
    return {
      title: useCache ? 'Dual behaves like Import for this slicer' : 'Dual joins the DirectQuery path for this visual',
      behavior: useCache ? 'Dimension cache' : 'One source query',
      observedVersion: useCache ? state.cacheVersion : state.sourceVersion,
      cacheIsStale: useCache && cacheIsStale,
      sourceQueried: !useCache,
      nativeQuery: !useCache,
      refreshAvailable: cacheIsStale,
      explanation: useCache
        ? `Only DimProduct is needed, so its Dual cache answers the slicer from v${state.cacheVersion}${cacheIsStale ? ` while the source is at v${state.sourceVersion}` : ''}.`
        : `FactSales is DirectQuery, so the Dual DimProduct participates in the same native source query. The result sees source v${state.sourceVersion}.`,
      steps: [
        { id: 'report', eyebrow: 'Request', title: isDimensionOnly ? 'Product slicer' : 'Revenue by category', detail: 'Query context determines Dual behavior.' },
        { id: 'model', eyebrow: 'Composite model', title: 'DimProduct · Dual', detail: isDimensionOnly ? 'No DirectQuery fact is required.' : 'FactSales · DirectQuery is required.' },
        useCache
          ? { id: 'memory', eyebrow: 'VertiPaq', title: `Dimension cache · v${state.cacheVersion}`, detail: 'The cached dimension serves the request.' }
          : { id: 'source', eyebrow: 'Source', title: `DimProduct + FactSales · v${state.sourceVersion}`, detail: 'One native query combines both tables.' },
      ] as PathStep[],
    };
  }

  return {
    title: 'Direct Lake loads needed columns from OneLake',
    behavior: 'Delta-backed column loading',
    observedVersion: state.sourceVersion,
    cacheIsStale: false,
    sourceQueried: false,
    nativeQuery: false,
    refreshAvailable: false,
    explanation: `The model uses VertiPaq to query Delta data in OneLake without first importing a separate copy. This overview shows data v${state.sourceVersion}; framing and fallback are explored in the Engine Room.`,
    steps: [
      { id: 'report', eyebrow: 'Request', title: isDimensionOnly ? 'Product slicer' : 'Revenue by category', detail: 'A report visual issues a DAX query.' },
      { id: 'model', eyebrow: 'Semantic model', title: 'Direct Lake tables', detail: 'The model identifies required columns.' },
      { id: 'memory', eyebrow: 'VertiPaq', title: 'On-demand column cache', detail: 'Needed columns are loaded for fast scans.' },
      { id: 'source', eyebrow: 'OneLake', title: `Delta tables · v${state.sourceVersion}`, detail: 'Data remains in OneLake rather than a separate import copy.' },
    ] as PathStep[],
  };
}

export const storageModeAccuracyNote = 'Conceptual path model. Actual performance, caching, query folding, and DirectQuery behavior depend on the source, model, capacity, and query.';
