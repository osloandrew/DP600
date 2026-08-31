import { dirtyOrders, storeRegions, type DirtyOrder } from '@/data/aurora/dirty-orders';

export type TransformId = 'change-date-type' | 'replace-null-quantity' | 'remove-duplicates' | 'join-region' | 'add-revenue' | 'filter-incomplete';
export type PipelineMetadata = { dateType: 'text' | 'date'; regionJoined: boolean; revenueAdded: boolean };
export type PipelineSnapshot = { rows: DirtyOrder[]; metadata: PipelineMetadata; removedRows: number; changedCells: string[] };

export const transformationDefinitions: Record<TransformId, {
  label: string; shortLabel: string; description: string; powerQuery: string; sql: string;
}> = {
  'change-date-type': { label: 'Change OrderDate type', shortLabel: 'Changed date type', description: 'Parse ISO and day-first dates into one Date representation.', powerQuery: 'Table.TransformColumnTypes(Source, {{"OrderDate", type date}})', sql: 'CAST(OrderDate AS date) AS OrderDate' },
  'replace-null-quantity': { label: 'Replace missing Qty with 0', shortLabel: 'Replaced missing Qty', description: 'Apply the explicit business rule that a missing quantity becomes zero.', powerQuery: 'Table.ReplaceValue(Source, null, 0, Replacer.ReplaceValue, {"Qty"})', sql: 'COALESCE(Qty, 0) AS Qty' },
  'remove-duplicates': { label: 'Remove duplicate rows', shortLabel: 'Removed duplicates', description: 'Keep one row for each identical business-value combination.', powerQuery: 'Table.Distinct(Source, {"OrderID", "Customer", "StoreID", "Region", "Qty", "Price", "OrderDate"})', sql: 'SELECT DISTINCT OrderID, Customer, StoreID, Region, Qty, Price, OrderDate' },
  'join-region': { label: 'Join store regions', shortLabel: 'Joined DimStore', description: 'Left join DimStore and use its Region only where the source Region is missing.', powerQuery: 'Table.NestedJoin(Source, {"StoreID"}, DimStore, {"StoreID"}, "Store", JoinKind.LeftOuter)', sql: 'LEFT JOIN DimStore s ON o.StoreID = s.StoreID' },
  'add-revenue': { label: 'Add Revenue column', shortLabel: 'Added Revenue', description: 'Derive line revenue from the quantity and unit price available at this step.', powerQuery: 'Table.AddColumn(Source, "Revenue", each [Qty] * [Price], Currency.Type)', sql: 'Qty * Price AS Revenue' },
  'filter-incomplete': { label: 'Filter incomplete rows', shortLabel: 'Filtered incomplete rows', description: 'Keep rows whose region, quantity, and date are all present at this step.', powerQuery: 'Table.SelectRows(Source, each [Region] <> null and [Qty] <> null and [OrderDate] <> null)', sql: 'WHERE Region IS NOT NULL AND Qty IS NOT NULL AND OrderDate IS NOT NULL' },
};

const initialMetadata: PipelineMetadata = { dateType: 'text', regionJoined: false, revenueAdded: false };

function businessKey(row: DirtyOrder) {
  return JSON.stringify([row.orderId, row.customer, row.storeId, row.region, row.quantity, row.unitPrice, row.orderDate]);
}

function parseDate(value: string | null) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(value);
  return match ? `20${match[3]}-${match[2]}-${match[1]}` : null;
}

export function applyTransformation(snapshot: PipelineSnapshot, id: TransformId): PipelineSnapshot {
  const before = snapshot.rows;
  let rows = before.map((row) => ({ ...row }));
  const metadata = { ...snapshot.metadata };
  const changedCells: string[] = [];

  if (id === 'change-date-type') {
    rows = rows.map((row) => {
      const orderDate = parseDate(row.orderDate);
      if (orderDate !== row.orderDate) changedCells.push(`${row.sourceRow}:orderDate`);
      return { ...row, orderDate };
    });
    metadata.dateType = 'date';
  }
  if (id === 'replace-null-quantity') rows = rows.map((row) => {
    if (row.quantity !== null) return row;
    changedCells.push(`${row.sourceRow}:quantity`);
    return { ...row, quantity: 0 };
  });
  if (id === 'remove-duplicates') {
    const seen = new Set<string>();
    rows = rows.filter((row) => { const key = businessKey(row); if (seen.has(key)) return false; seen.add(key); return true; });
  }
  if (id === 'join-region') {
    rows = rows.map((row) => {
      if (row.region !== null) return row;
      changedCells.push(`${row.sourceRow}:region`);
      return { ...row, region: storeRegions[row.storeId] };
    });
    metadata.regionJoined = true;
  }
  if (id === 'add-revenue') {
    rows = rows.map((row) => {
      changedCells.push(`${row.sourceRow}:revenue`);
      return { ...row, revenue: row.quantity === null ? null : row.quantity * row.unitPrice };
    });
    metadata.revenueAdded = true;
  }
  if (id === 'filter-incomplete') rows = rows.filter((row) => row.region !== null && row.quantity !== null && row.orderDate !== null);

  return { rows, metadata, removedRows: before.length - rows.length, changedCells };
}

export function evaluatePipeline(ids: TransformId[], throughStep = ids.length): PipelineSnapshot {
  let snapshot: PipelineSnapshot = { rows: dirtyOrders.map((row) => ({ ...row })), metadata: { ...initialMetadata }, removedRows: 0, changedCells: [] };
  for (const id of ids.slice(0, throughStep)) snapshot = applyTransformation(snapshot, id);
  return snapshot;
}

export function getQualitySummary(rows: DirtyOrder[]) {
  const seen = new Set<string>(); let duplicates = 0;
  for (const row of rows) { const key = businessKey(row); if (seen.has(key)) duplicates += 1; else seen.add(key); }
  const missingCells = rows.reduce((count, row) => count + [row.region, row.quantity, row.orderDate].filter((value) => value === null).length, 0);
  return { duplicates, missingCells, rowCount: rows.length };
}

export const transformationAccuracyNote = 'This deterministic sandbox illustrates step order and table-shaping effects. It does not execute Power Query, SQL, or Fabric compute.';
