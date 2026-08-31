export type QuerySurface = 'visual' | 'sql' | 'kql' | 'dax';
export type QueryTask = 'filter' | 'aggregate' | 'group';

export const querySurfaceMeta: Record<QuerySurface, { label: string; location: string; language: string; purpose: string }> = {
  visual: { label: 'Visual', location: 'Warehouse visual query editor', language: 'Generates T-SQL', purpose: 'Build relational operations through a visual canvas.' },
  sql: { label: 'SQL', location: 'Warehouse', language: 'T-SQL', purpose: 'Retrieve and transform relational tables.' },
  kql: { label: 'KQL', location: 'Eventhouse · KQL database', language: 'KQL', purpose: 'Explore time-oriented events and telemetry.' },
  dax: { label: 'DAX', location: 'Semantic model', language: 'DAX', purpose: 'Evaluate model-aware measures under filter context.' },
};

export const queryTaskMeta: Record<QueryTask, { label: string; question: string }> = {
  filter: { label: 'Filter', question: 'Focus the current layer on the North region' },
  aggregate: { label: 'Aggregate', question: 'Reduce many records to one business result' },
  group: { label: 'Group', question: 'Compare a result across regions' },
};

const code: Record<QuerySurface, Record<QueryTask, string>> = {
  visual: {
    filter: 'FactSales\n  FILTER Region = "North"\n  SELECT OrderID, Revenue',
    aggregate: 'FactSales\n  AGGREGATE SUM Revenue',
    group: 'FactSales\n  JOIN DimRegion\n  GROUP BY Region\n  AGGREGATE SUM Revenue',
  },
  sql: {
    filter: 'SELECT OrderID, Revenue\nFROM FactSales\nWHERE Region = \'North\';',
    aggregate: 'SELECT SUM(Revenue) AS TotalRevenue\nFROM FactSales;',
    group: 'SELECT r.Region, SUM(f.Revenue) AS Revenue\nFROM FactSales f\nJOIN DimRegion r ON f.RegionKey = r.RegionKey\nGROUP BY r.Region;',
  },
  kql: {
    filter: 'DeliveryTelemetry\n| where Region == "North"\n| project DeliveryId, Timestamp, Status',
    aggregate: 'DeliveryTelemetry\n| summarize DeliveryEvents = count()',
    group: 'DeliveryTelemetry\n| summarize Deliveries = dcount(DeliveryId) by Region',
  },
  dax: {
    filter: 'EVALUATE\nCALCULATETABLE(\n  SUMMARIZECOLUMNS(FactSales[OrderID], "Revenue", [Total Sales]),\n  DimRegion[Region] = "North"\n)',
    aggregate: 'EVALUATE\nROW("Total Revenue", [Total Sales])',
    group: 'EVALUATE\nSUMMARIZECOLUMNS(\n  DimRegion[Region],\n  "Revenue", [Total Sales]\n)',
  },
};

const result: Record<QuerySurface, Record<QueryTask, { label: string; value: string; rows: string[] }>> = {
  visual: {
    filter: { label: 'Generated relational result', value: '2 rows', rows: ['#10481 · $998', '#10484 · $447'] },
    aggregate: { label: 'Generated relational result', value: '$3,251', rows: ['TotalRevenue · $3,251'] },
    group: { label: 'Generated relational result', value: '3 groups', rows: ['North · $1,445', 'South · $658', 'West · $1,148'] },
  },
  sql: {
    filter: { label: 'Warehouse rows returned', value: '2 rows', rows: ['#10481 · $998', '#10484 · $447'] },
    aggregate: { label: 'Warehouse scalar result', value: '$3,251', rows: ['TotalRevenue · $3,251'] },
    group: { label: 'Warehouse grouped rows', value: '3 rows', rows: ['North · $1,445', 'South · $658', 'West · $1,148'] },
  },
  kql: {
    filter: { label: 'Telemetry events returned', value: '4 events', rows: ['D-882 · 10:02 · Loaded', 'D-884 · 10:04 · En route', 'D-885 · 10:06 · Delayed'] },
    aggregate: { label: 'Eventhouse scalar result', value: '12 events', rows: ['DeliveryEvents · 12'] },
    group: { label: 'Eventhouse grouped result', value: '3 regions', rows: ['North · 4 deliveries', 'South · 3 deliveries', 'West · 2 deliveries'] },
  },
  dax: {
    filter: { label: 'Model result under filter context', value: '$1,445', rows: ['Region filter · North', '[Total Sales] · $1,445'] },
    aggregate: { label: 'Measure result', value: '$3,251', rows: ['[Total Sales] · $3,251'] },
    group: { label: 'Measure evaluated per group', value: '3 groups', rows: ['North · $1,445', 'South · $658', 'West · $1,148'] },
  },
};

export function getQueryScenario(surface: QuerySurface, task: QueryTask) {
  return { ...querySurfaceMeta[surface], ...queryTaskMeta[task], code: code[surface][task], result: result[surface][task] };
}

export const queryAccuracyNote = 'Curated results make layer and purpose visible; this lab does not connect to a live Warehouse, Eventhouse, or semantic model.';
