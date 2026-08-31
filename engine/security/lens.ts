export type SecurityIdentity = 'workspace-admin' | 'data-analyst' | 'norway-sales' | 'sweden-sales' | 'report-viewer' | 'external-consumer';
export type SecurityLayer = 'workspace' | 'item' | 'semantic-model' | 'object' | 'column' | 'row' | 'onelake';

export const securityRows = [
  { orderId: 10481, region: 'Norway', product: 'Trail Pack', revenue: 998, margin: 318, unitCost: 340 },
  { orderId: 10482, region: 'Sweden', product: 'Summit Tent', revenue: 899, margin: 279, unitCost: 620 },
  { orderId: 10483, region: 'Norway', product: 'Camp Mug', revenue: 147, margin: 72, unitCost: 25 },
  { orderId: 10484, region: 'Denmark', product: 'Rain Shell', revenue: 249, margin: 89, unitCost: 160 },
] as const;

export const securityIdentityLabels: Record<SecurityIdentity, string> = {
  'workspace-admin': 'Workspace Admin',
  'data-analyst': 'Data Analyst',
  'norway-sales': 'Norway Sales',
  'sweden-sales': 'Sweden Sales',
  'report-viewer': 'Report Viewer',
  'external-consumer': 'External Consumer',
};

const identityRules = {
  'workspace-admin': { workspace: 'Admin', item: 'Edit all items', report: true, region: 'All', hiddenObjects: [], hiddenColumns: [], oneLake: 'Workspace role override', directRegion: 'All' },
  'data-analyst': { workspace: 'Contributor', item: 'Edit Sales model', report: true, region: 'All', hiddenObjects: [], hiddenColumns: [], oneLake: 'Workspace role override', directRegion: 'All' },
  'norway-sales': { workspace: 'Viewer', item: 'Read Sales report', report: true, region: 'Norway', hiddenObjects: ['DimSupplier'], hiddenColumns: ['Margin'], oneLake: 'Norway curated role', directRegion: 'Norway' },
  'sweden-sales': { workspace: 'Viewer', item: 'Read Sales report', report: true, region: 'Sweden', hiddenObjects: ['DimSupplier'], hiddenColumns: ['Margin'], oneLake: 'Sweden curated role', directRegion: 'Sweden' },
  'report-viewer': { workspace: 'Viewer', item: 'Read Sales report', report: true, region: 'All', hiddenObjects: ['DimSupplier'], hiddenColumns: ['UnitCost'], oneLake: 'No OneLake role', directRegion: 'None' },
  'external-consumer': { workspace: 'No workspace role', item: 'Shared report · Read', report: true, region: 'Norway', hiddenObjects: ['DimSupplier'], hiddenColumns: ['Margin', 'UnitCost'], oneLake: 'No OneLake role', directRegion: 'None' },
} as const;

export function evaluateSecurity(identity: SecurityIdentity) {
  const rule = identityRules[identity];
  const modelSecurityBypassed = identity === 'workspace-admin' || identity === 'data-analyst';
  const reportRows = securityRows.filter((row) => rule.region === 'All' || row.region === rule.region);
  const directRows = securityRows.filter((row) => rule.directRegion === 'All' || row.region === rule.directRegion);
  const oneLakeBlocked = rule.directRegion === 'None';
  const visibleColumns = ['OrderID', 'Region', 'Product', 'Revenue', 'Margin', 'UnitCost'].filter((column) => !rule.hiddenColumns.includes(column as never));
  const activeLayers: SecurityLayer[] = ['workspace', 'item'];
  if (!modelSecurityBypassed) activeLayers.push('semantic-model', 'object', 'column', 'row');
  activeLayers.push('onelake');

  return {
    ...rule,
    modelSecurityBypassed,
    reportRows,
    directRows: oneLakeBlocked ? [] : directRows,
    oneLakeBlocked,
    visibleColumns,
    activeLayers,
    totalRevenue: reportRows.reduce((total, row) => total + row.revenue, 0),
    explanation: modelSecurityBypassed
      ? `${rule.workspace} is an edit-capable workspace role, so semantic-model RLS and OLS are not enforced for this identity. Its workspace role also provides OneLake access.`
      : `${rule.item} gets this identity to the report. Semantic-model security then returns ${rule.region === 'All' ? 'all permitted' : `${rule.region} only`} rows, while direct OneLake access is evaluated by a separate data role.`,
  };
}

export const securityLayerCopy: Record<SecurityLayer, { title: string; mechanism: string; explanation: string }> = {
  workspace: { title: 'Workspace', mechanism: 'Workspace role', explanation: 'Admin, Member, Contributor, and Viewer control capabilities across items in the workspace.' },
  item: { title: 'Item', mechanism: 'Item permission', explanation: 'Sharing can grant Read on one report or semantic model without changing the workspace role.' },
  'semantic-model': { title: 'Semantic model', mechanism: 'Model role', explanation: 'Role membership connects a report consumer identity to semantic-model RLS and OLS rules.' },
  object: { title: 'Table / object', mechanism: 'OLS', explanation: 'Object-level security can make a model table or column—and its metadata—appear not to exist.' },
  column: { title: 'Column', mechanism: 'OLS or OneLake CLS', explanation: 'Semantic-model OLS can secure model columns. OneLake column-level security independently restricts Delta table columns.' },
  row: { title: 'Row', mechanism: 'RLS', explanation: 'Semantic-model RLS filters report data. OneLake RLS is a distinct rule applied at the data plane.' },
  onelake: { title: 'OneLake data', mechanism: 'OneLake security role', explanation: 'Direct table and file access is evaluated at OneLake. A shared report does not automatically grant direct data access.' },
};

export const securityAccuracyNote = 'Deterministic teaching model. Effective access can combine identities, roles, permissions, item types, engines, and tenant settings.';
