export const exam = {
  code: 'DP-600', blueprintEffectiveDate: '2026-07-21', verifiedDate: '2026-08-31',
  domains: [
    { id: 'maintain', title: 'Maintain a data analytics solution', weight: '25–30%' },
    { id: 'prepare', title: 'Prepare data', weight: '45–50%' },
    { id: 'models', title: 'Implement and manage semantic models', weight: '25–30%' },
  ],
} as const;

export type ExamDomainId = (typeof exam.domains)[number]['id'];
export type CoverageState = 'built' | 'partial' | 'planned';
export type CoverageExperience = { title: string; state: CoverageState; href?: string };
export type ExamObjectiveGroup = { id: string; domainId: ExamDomainId; title: string; detail: string; experiences: CoverageExperience[] };

export const examObjectiveGroups: ExamObjectiveGroup[] = [
  { id: 'security', domainId: 'maintain', title: 'Security and access', detail: 'Workspace and item access, RLS, CLS, OLS, and file-level security.', experiences: [{ title: 'Security Lens', state: 'built', href: '#/lab/security' }] },
  { id: 'governance', domainId: 'maintain', title: 'Governance', detail: 'Sensitivity labels and endorsements.', experiences: [{ title: 'Governance Lab', state: 'planned' }] },
  { id: 'lifecycle', domainId: 'maintain', title: 'Development lifecycle', detail: 'Git, PBIP, deployment pipelines, XMLA, reusable assets, and impact analysis.', experiences: [{ title: 'Lifecycle Lab', state: 'planned' }, { title: 'Lineage and Impact Lab', state: 'planned' }] },
  { id: 'connections', domainId: 'prepare', title: 'Connect, discover, and ingest', detail: 'Connections, OneLake catalog, Real-Time Hub, and ingest-versus-access choices.', experiences: [{ title: 'Fabric Atlas', state: 'partial', href: '#explore' }, { title: 'Catalog and Real-Time explorers', state: 'planned' }] },
  { id: 'stores', domainId: 'prepare', title: 'Choose a Fabric data store', detail: 'Lakehouse, Warehouse, Eventhouse, and OneLake integration tradeoffs.', experiences: [{ title: 'Data Store Lab', state: 'built', href: '#/lab/data-stores' }, { title: 'Fabric Atlas', state: 'partial', href: '#explore' }] },
  { id: 'transform', domainId: 'prepare', title: 'Transform data', detail: 'Views, procedures, derived data, joins, quality, types, and filters.', experiences: [{ title: 'Transformation Workbench', state: 'partial', href: '#/lab/transformation' }, { title: 'SCD Time Machine', state: 'built', href: '#/lab/scd' }] },
  { id: 'schema', domainId: 'prepare', title: 'Shape analytical schemas', detail: 'Star schemas, denormalization, aggregation, dimensions, and facts.', experiences: [{ title: 'Schema Lab', state: 'built', href: '#/lab/schema' }] },
  { id: 'query', domainId: 'prepare', title: 'Query and analyze', detail: 'Visual Query Editor, T-SQL, KQL, DAX, filtering, and aggregation.', experiences: [{ title: 'Query Rosetta', state: 'built', href: '#/lab/query' }, { title: 'DAX Microscope', state: 'partial', href: '#/lab/dax' }] },
  { id: 'model-design', domainId: 'models', title: 'Design semantic models', detail: 'Storage modes, star schemas, relationships, bridge tables, and many-to-many.', experiences: [{ title: 'Relationship Lab', state: 'built', href: '#/lab/relationships' }, { title: 'Schema Lab', state: 'built', href: '#/lab/schema' }, { title: 'Storage Mode Lab', state: 'built', href: '#/lab/storage-modes' }] },
  { id: 'dax', domainId: 'models', title: 'Create model calculations', detail: 'Variables, iterators, table filters, windowing, information functions, and calculation groups.', experiences: [{ title: 'DAX Microscope', state: 'partial', href: '#/lab/dax' }, { title: 'Calculation Group Lab', state: 'built', href: '#/lab/calculation-groups' }] },
  { id: 'model-features', domainId: 'models', title: 'Configure model features', detail: 'Dynamic formats, field parameters, large models, and composite models.', experiences: [{ title: 'Field Parameter Explorer', state: 'built', href: '#/lab/field-parameters' }, { title: 'Composite Model Lab', state: 'built', href: '#/lab/composite-models' }] },
  { id: 'performance', domainId: 'models', title: 'Optimize performance', detail: 'Query, report visual, and DAX performance.', experiences: [{ title: 'Performance Lab', state: 'built', href: '#/lab/performance' }, { title: 'DAX Microscope', state: 'partial', href: '#/lab/dax' }] },
  { id: 'direct-lake', domainId: 'models', title: 'Manage Direct Lake', detail: 'OneLake and SQL-endpoint paths, column loading, framing, and fallback behavior.', experiences: [{ title: 'Direct Lake Engine Room', state: 'built', href: '#/lab/direct-lake' }] },
  { id: 'incremental', domainId: 'models', title: 'Configure incremental refresh', detail: 'Range parameters, policies, partitions, and refresh windows.', experiences: [{ title: 'Incremental Refresh Time Machine', state: 'built', href: '#/lab/incremental-refresh' }] },
];
