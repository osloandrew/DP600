export type FoundationModuleId = 'data-basics' | 'relational-basics' | 'analytical-model-basics' | 'query-basics' | 'fabric-stack-basics';
export type FoundationConceptId =
  | 'tables-rows-columns' | 'data-types-and-nulls' | 'keys-and-uniqueness'
  | 'joins-and-relationships' | 'cardinality' | 'filter-direction'
  | 'operational-vs-analytical' | 'fact-and-dimension' | 'grain' | 'star-schema'
  | 'transform-query-calculate' | 'sql-kql-dax-overview'
  | 'source-to-report-path' | 'workspace-and-items' | 'refresh-cache-live-query';

export type FoundationConcept = {
  id: FoundationConceptId;
  moduleId: FoundationModuleId;
  title: string;
  plainMeaning: string;
  auroraExample: string;
  whyItMattersLater: string;
  relatedLabs: { label: string; href: string }[];
  check: { prompt: string; reveal: string };
};

export const foundationModules: { id: FoundationModuleId; title: string; description: string }[] = [
  { id: 'data-basics', title: 'Data basics', description: 'Tables, types, and keys — the raw material every Fabric object is built from.' },
  { id: 'relational-basics', title: 'Relational basics', description: 'How tables connect, and how a filter chosen on one table reaches another.' },
  { id: 'analytical-model-basics', title: 'Analytical-model basics', description: 'Why operational data gets reshaped before it can answer business questions.' },
  { id: 'query-basics', title: 'Query and calculation basics', description: 'What it means to transform, query, and calculate, and where each language operates.' },
  { id: 'fabric-stack-basics', title: 'Fabric stack basics', description: 'How Power BI fits inside Microsoft Fabric, end to end.' },
];

export const foundations: Record<FoundationConceptId, FoundationConcept> = {
  'tables-rows-columns': {
    id: 'tables-rows-columns', moduleId: 'data-basics', title: 'Tables, rows, and columns',
    plainMeaning: "A table stores records as rows, and each row's properties as columns.",
    auroraExample: "Aurora's Orders table has one row per order, with columns like OrderID, CustomerID, and OrderDate.",
    whyItMattersLater: 'Every Fabric store, transformation step, and semantic-model table is built from this same shape.',
    relatedLabs: [{ label: 'Schema Lab', href: '#/lab/schema' }, { label: 'Transformation Workbench', href: '#/lab/transformation' }],
    check: { prompt: "Aurora's Orders table has 40,000 rows and 8 columns. If you add a Discount column, what changes?", reveal: "The column count becomes 9. The row count is unaffected — adding a column doesn't add records." },
  },
  'data-types-and-nulls': {
    id: 'data-types-and-nulls', moduleId: 'data-basics', title: 'Data types and null values',
    plainMeaning: 'Every column has a data type, and a value can be missing entirely — that is null, not zero or blank text.',
    auroraExample: "Some early Aurora orders have a null Region because the field wasn't required yet.",
    whyItMattersLater: 'Wrong types and unhandled nulls break joins, aggregations, and comparisons throughout Prepare-data work.',
    relatedLabs: [{ label: 'Transformation Workbench', href: '#/lab/transformation' }],
    check: { prompt: 'An order’s Region column is blank. Is that the same as Region = "Unknown"?', reveal: 'No. A null means no value was recorded at all; "Unknown" is an actual text value. Treating them the same can hide a data-quality problem.' },
  },
  'keys-and-uniqueness': {
    id: 'keys-and-uniqueness', moduleId: 'data-basics', title: 'Keys and uniqueness',
    plainMeaning: 'A key is a column, or set of columns, that identifies a row, and a primary key must be unique.',
    auroraExample: 'CustomerID uniquely identifies each Aurora customer; two customers can share a name but never a CustomerID.',
    whyItMattersLater: 'Relationships and the "one" side of a one-to-many link require a unique key — this becomes essential in Schema and Relationship Lab.',
    relatedLabs: [{ label: 'Schema Lab', href: '#/lab/schema' }, { label: 'Relationship Lab', href: '#/lab/relationships' }],
    check: { prompt: "Could OrderDate be a good primary key for Aurora's Orders table?", reveal: "No — many orders share the same date, so OrderDate isn't unique. OrderID is the primary key." },
  },
  'joins-and-relationships': {
    id: 'joins-and-relationships', moduleId: 'relational-basics', title: 'Joins and relationships',
    plainMeaning: 'A join combines rows from two tables that share a matching key; a relationship is a standing, reusable version of that link inside a model.',
    auroraExample: 'Joining Orders to Customers on CustomerID lets you see each order’s customer name.',
    whyItMattersLater: 'Semantic models use relationships instead of one-off joins so every report can reuse the same connection.',
    relatedLabs: [{ label: 'Query Rosetta', href: '#/lab/query' }, { label: 'Relationship Lab', href: '#/lab/relationships' }],
    check: { prompt: 'Why build a relationship in the semantic model instead of joining tables in every query?', reveal: "A relationship is defined once and reused by every measure and report — you don't need to rewrite the join logic each time." },
  },
  cardinality: {
    id: 'cardinality', moduleId: 'relational-basics', title: 'One-to-many vs many-to-many',
    plainMeaning: 'Cardinality describes how many rows on one side of a relationship can match rows on the other side.',
    auroraExample: 'One DimProduct row can match many FactSales rows — one product, many sales — so that’s one-to-many.',
    whyItMattersLater: 'Most star-schema relationships are one-to-many; many-to-many needs special handling like a bridge table.',
    relatedLabs: [{ label: 'Relationship Lab', href: '#/lab/relationships' }],
    check: { prompt: 'Aurora customers can hold several purchasing accounts, and some accounts are shared by several customers. Is Customer-to-Account one-to-many?', reveal: "No — it's many-to-many on both sides, which is why Aurora needs a bridge table between Customer and Account." },
  },
  'filter-direction': {
    id: 'filter-direction', moduleId: 'relational-basics', title: 'Filter direction',
    plainMeaning: 'A filter chosen on one table can propagate across a relationship to related tables — but only in the direction the relationship allows.',
    auroraExample: 'Filtering DimRegion to "Norway" propagates to FactSales because the relationship’s filter direction runs from DimRegion to FactSales.',
    whyItMattersLater: 'Filter direction is the core idea behind RLS, CALCULATE, and bidirectional relationships.',
    relatedLabs: [{ label: 'Relationship Lab', href: '#/lab/relationships' }, { label: 'DAX Microscope', href: '#/lab/dax' }],
    check: { prompt: 'If DimRegion filters FactSales by default, can filtering FactSales narrow down DimRegion too?', reveal: 'Not unless the relationship is set to filter both directions. By default the filter travels one way: from the "one" side to the "many" side.' },
  },
  'operational-vs-analytical': {
    id: 'operational-vs-analytical', moduleId: 'analytical-model-basics', title: 'Operational data vs analytical model',
    plainMeaning: 'Operational systems store data to run the business moment to moment; an analytical model reshapes that same data to answer questions across time and categories.',
    auroraExample: "Aurora's point-of-sale system records each sale as it happens; the analytical model reshapes months of those sales for reporting.",
    whyItMattersLater: "Recognizing this split explains why Aurora doesn't point reports directly at operational databases.",
    relatedLabs: [{ label: 'Data Store Lab', href: '#/lab/data-stores' }],
    check: { prompt: "Aurora's checkout system needs to record a sale instantly. Does it need a star schema to do that?", reveal: 'No — operational systems are optimized for fast, reliable individual transactions, not analytical reshaping. The star schema comes later, for analysis.' },
  },
  'fact-and-dimension': {
    id: 'fact-and-dimension', moduleId: 'analytical-model-basics', title: 'Fact and dimension tables',
    plainMeaning: 'A fact table records measurable events; a dimension table describes the business entities used to filter and group those events.',
    auroraExample: "FactSales records each order line's quantity and revenue; DimProduct and DimRegion describe what was sold and where.",
    whyItMattersLater: 'This is the foundation of every star schema and semantic model in the site.',
    relatedLabs: [{ label: 'Schema Lab', href: '#/lab/schema' }],
    check: { prompt: "Is DimProduct's ProductCategory a fact or a dimension attribute?", reveal: "A dimension attribute — it describes a product so you can group and filter by it. It isn't a measurable event." },
  },
  grain: {
    id: 'grain', moduleId: 'analytical-model-basics', title: 'Grain',
    plainMeaning: 'Grain is what one row of a fact table represents — the level of detail it is recorded at.',
    auroraExample: "FactSales' current grain is one row per order line, not per order and not per day.",
    whyItMattersLater: "Mixing grains in one fact table silently breaks totals — this shows up directly in Schema Lab's warnings.",
    relatedLabs: [{ label: 'Schema Lab', href: '#/lab/schema' }],
    check: { prompt: "If you add a row for each order's shipping fee at the order level into a table whose grain is one row per order line, what happens?", reveal: 'The table now mixes two grains. Summing a measure could double-count or misattribute the shipping fee across order lines.' },
  },
  'star-schema': {
    id: 'star-schema', moduleId: 'analytical-model-basics', title: 'Star schema',
    plainMeaning: 'A star schema is a model with fact tables at the center connected to surrounding dimension tables, minimizing repeated descriptive data.',
    auroraExample: 'FactSales sits at the center, connected to DimProduct, DimStore, DimRegion, and DimDate.',
    whyItMattersLater: "Star schemas are the default target shape for Fabric semantic models and the exam's modeling questions.",
    relatedLabs: [{ label: 'Schema Lab', href: '#/lab/schema' }, { label: 'Relationship Lab', href: '#/lab/relationships' }],
    check: { prompt: 'A wide table repeats CustomerCity on every order row. What does turning it into a star schema fix?', reveal: 'It moves CustomerCity into DimCustomer once, instead of repeating it on every order row — reducing repetition and making filtering by city consistent.' },
  },
  'transform-query-calculate': {
    id: 'transform-query-calculate', moduleId: 'query-basics', title: 'Transform, query, and calculate',
    plainMeaning: 'Transforming reshapes stored data, querying retrieves and filters it, and calculating derives new values from it inside a model.',
    auroraExample: 'Aurora transforms dirty order rows once, queries FactSales for a monthly total, and calculates a Gross Margin % measure at report time.',
    whyItMattersLater: 'DP-600 tests all three separately: Power Query/dataflows, SQL/KQL querying, and DAX calculation.',
    relatedLabs: [{ label: 'Transformation Workbench', href: '#/lab/transformation' }, { label: 'Query Rosetta', href: '#/lab/query' }],
    check: { prompt: 'Removing duplicate OrderIDs — is that a transformation or a calculation?', reveal: 'A transformation. It changes the stored data itself, rather than deriving a new value at query or report time.' },
  },
  'sql-kql-dax-overview': {
    id: 'sql-kql-dax-overview', moduleId: 'query-basics', title: 'SQL, KQL, and DAX at a glance',
    plainMeaning: 'Each language operates on a different layer: SQL queries relational stores, KQL queries event and telemetry stores, and DAX calculates over a semantic model’s filter context.',
    auroraExample: 'Aurora queries the Warehouse with T-SQL, queries DeliveryTelemetry in Eventhouse with KQL, and defines Total Sales with DAX in the semantic model.',
    whyItMattersLater: 'The exam expects you to recognize which layer a scenario is describing, not just which language looks familiar.',
    relatedLabs: [{ label: 'Query Rosetta', href: '#/lab/query' }],
    check: { prompt: 'A requirement mentions analyzing time-windowed telemetry events. Which language is it pointing to?', reveal: "KQL — telemetry and event analysis over an Eventhouse is KQL's purpose, not SQL's or DAX's." },
  },
  'source-to-report-path': {
    id: 'source-to-report-path', moduleId: 'fabric-stack-basics', title: 'Source → OneLake → store → model → report',
    plainMeaning: 'Data moves from a source system, into OneLake-backed storage, through a Lakehouse, Warehouse, or Eventhouse, into a semantic model, and finally into a report.',
    auroraExample: "Order #10482 starts in Aurora's operational database and ends as a filtered row behind a revenue number on Marta's report.",
    whyItMattersLater: 'This is the backbone of the Fabric Atlas and the first field-trip stop — every lab is a close-up of one segment of this path.',
    relatedLabs: [{ label: 'Fabric Atlas', href: '#explore' }],
    check: { prompt: 'Does a report normally query the source database directly?', reveal: 'Not normally — a report queries the semantic model, which is built on data that moved through a Fabric store. Direct Lake and DirectQuery change how that connection happens, but the report itself still targets the model.' },
  },
  'workspace-and-items': {
    id: 'workspace-and-items', moduleId: 'fabric-stack-basics', title: 'Workspace and Fabric items',
    plainMeaning: 'A workspace is a container that groups related Fabric items — like lakehouses, warehouses, semantic models, and reports — for a team or project.',
    auroraExample: 'Aurora’s "Sales Analytics" workspace holds the RetailLake lakehouse, the Sales semantic model, and the executive report together.',
    whyItMattersLater: 'Workspace roles are the outermost layer of Fabric security, covered directly in Security Lens.',
    relatedLabs: [{ label: 'Security Lens', href: '#/lab/security' }],
    check: { prompt: 'Jonas has a role in Aurora’s "Sales Analytics" workspace. Does that automatically give him access to every item inside it?', reveal: 'It depends on the role and item-level permissions — workspace access is the outer layer, but individual items can still carry their own permission settings.' },
  },
  'refresh-cache-live-query': {
    id: 'refresh-cache-live-query', moduleId: 'fabric-stack-basics', title: 'Refresh, cache, and live query',
    plainMeaning: 'Some storage modes copy data into memory on a schedule — refresh, into a cache; others query the source live for every request.',
    auroraExample: 'An Import-mode model refreshes on a schedule; a DirectQuery model asks the Warehouse fresh on every report interaction.',
    whyItMattersLater: 'This distinction is the entire subject of the Storage Mode Lab and Direct Lake Engine Room.',
    relatedLabs: [{ label: 'Storage Mode Lab', href: '#/lab/storage-modes' }, { label: 'Direct Lake Engine Room', href: '#/lab/direct-lake' }],
    check: { prompt: 'A DirectQuery report shows revenue as of two minutes ago without anyone clicking refresh. Why?', reveal: "DirectQuery doesn't rely on a scheduled refresh — it queries the source live each time the report needs data." },
  },
};

export const foundationOrder: FoundationConceptId[] = Object.keys(foundations) as FoundationConceptId[];
