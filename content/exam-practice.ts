export type ExamPracticeOption = { id: string; label: string; explanation: string };

export type ExamScenario = {
  id: string;
  domain: string;
  objectiveIds: string[];
  title: string;
  context: string;
  question: string;
  options: ExamPracticeOption[];
  answerId: string;
  decisiveClue: string;
  remediation: { label: string; href: string };
};

const option = (id: string, label: string, explanation: string): ExamPracticeOption => ({ id, label, explanation });

export const examScenarios: ExamScenario[] = [
  {
    id: 'warehouse-for-relational-reporting', domain: 'Prepare data', objectiveIds: ['PREPARE.GET.STORE_SELECTION'], title: 'A governed retail reporting store',
    context: 'Aurora needs to load structured sales transactions in batches. Finance analysts use T-SQL heavily and need governed enterprise BI reporting. Device telemetry is handled by another team.',
    question: 'Where should Priya begin for this reporting workload?',
    options: [option('warehouse', 'Warehouse', 'Warehouse best matches structured relational data, T-SQL, and enterprise BI requirements.'), option('lakehouse', 'Lakehouse', 'Lakehouse can support analytics and engineering, but the stated relational T-SQL reporting requirements make Warehouse the stronger fit.'), option('eventhouse', 'Eventhouse', 'Eventhouse is intended for event and telemetry analysis, which the scenario explicitly puts elsewhere.')],
    answerId: 'warehouse', decisiveClue: 'Structured transactions + T-SQL + governed BI are the requirements that matter; the telemetry detail is not part of this workload.', remediation: { label: 'Revisit Data Store Lab', href: '#/lab/data-stores' },
  },
  {
    id: 'region-row-security', domain: 'Maintain a data analytics solution', objectiveIds: ['MAINTAIN.SECURITY.ROW'], title: 'One report, different regional views',
    context: 'Jonas can open Aurora’s Sales report. He must see only Norway rows while Sweden managers use the same report and semantic model to see Sweden rows.',
    question: 'Which control should Leila configure?',
    options: [option('rls', 'Row-level security on the semantic model', 'RLS filters model rows for the signed-in identity while allowing users to open the same report.'), option('item', 'A separate item permission for each region', 'Item permission determines access to an item, not which subset of rows appears after it opens.'), option('ols', 'Object-level security for the sales table', 'OLS hides a table or object entirely; Jonas still needs the sales table, filtered to Norway.')],
    answerId: 'rls', decisiveClue: 'The requirement is about a different subset of rows after the report opens, which points specifically to RLS.', remediation: { label: 'Revisit Security Lens', href: '#/lab/security' },
  },
  {
    id: 'direct-lake-onelake', domain: 'Implement and manage semantic models', objectiveIds: ['MODEL.DESIGN.STORAGE', 'MODEL.OPTIMIZE.DIRECT_LAKE'], title: 'Fresh analysis over large Delta tables',
    context: 'Aurora stores large sales tables as Delta tables in OneLake. Marta wants interactive analytics without relying on a traditional full Import refresh before report queries run.',
    question: 'Which storage mode most directly fits the scenario?',
    options: [option('direct-lake', 'Direct Lake', 'Direct Lake is designed to query required Delta-table columns from OneLake for interactive analytics without the traditional full Import-copy path.'), option('import', 'Import', 'Import depends on a copied in-memory model refreshed on a schedule, which conflicts with the stated requirement.'), option('directquery', 'DirectQuery', 'DirectQuery is a source-query path; the OneLake Delta-table and no-traditional-Import clues point to Direct Lake.')],
    answerId: 'direct-lake', decisiveClue: 'The combination of Delta tables in OneLake, interactive analytics, and avoiding a traditional full Import refresh is decisive.', remediation: { label: 'Revisit Storage Mode Lab', href: '#/lab/storage-modes' },
  },
  {
    id: 'bridge-for-shared-accounts', domain: 'Implement and manage semantic models', objectiveIds: ['MODEL.DESIGN.RELATIONSHIPS'], title: 'Shared customer accounts',
    context: 'Some Aurora customers hold several purchasing accounts. Some accounts are shared by several customer entities. Finance needs balances by customer without duplicating balance facts.',
    question: 'Which model design fits this requirement?',
    options: [option('bridge', 'Use a CustomerAccount bridge table between Customer and Account', 'A bridge records the shared associations while preserving each balance fact once.'), option('many-to-many', 'Create a direct many-to-many relationship from Customer to FactBalance', 'This skips the account association and makes filtering harder to reason about.'), option('duplicate', 'Duplicate balance rows once for each linked customer', 'Duplicating facts would overstate balances when totals are calculated.')],
    answerId: 'bridge', decisiveClue: 'Both sides can have several associations, but the facts must not be duplicated: that is the bridge-table pattern.', remediation: { label: 'Revisit Relationship Lab', href: '#/lab/relationships' },
  },
  {
    id: 'transform-duplicate-order-lines', domain: 'Prepare data', objectiveIds: ['PREPARE.TRANSFORM.DATA_QUALITY'], title: 'A retried API call duplicates order lines',
    context: 'Aurora’s daily order export occasionally lands the same order line twice because a retried API call resubmitted it. Separately, OrderDate arrives as inconsistent text such as “2026-03-08” and “03/08/2026”.',
    question: 'Which operation fixes the retried-call problem specifically, without touching OrderDate values?',
    options: [option('dedupe', 'Remove duplicate rows using the order line key', 'Yes. This removes the repeated record introduced by the retry while leaving other columns untouched.'), option('type', 'Change OrderDate to a date type', 'This resolves the inconsistent date text, not the duplicated order line.'), option('merge', 'Merge queries on OrderID', 'Merging combines data from another query; it does not remove a row duplicated by a retried call.')],
    answerId: 'dedupe', decisiveClue: 'A row repeated because of a retried call is a duplicate-row problem, distinct from the separate date-format issue in the same scenario.', remediation: { label: 'Revisit Transformation Workbench', href: '#/lab/transformation' },
  },
  {
    id: 'schema-loyalty-rate-placement', domain: 'Prepare data', objectiveIds: ['PREPARE.TRANSFORM.STAR'], title: 'A repeating loyalty rate is not a fact',
    context: 'Aurora’s raw sales export includes a loyalty-tier discount rate on every order line. The same rate repeats across every row for a given customer, and Marta wants to group revenue by loyalty tier.',
    question: 'Where should the loyalty discount rate live in the star schema?',
    options: [option('dimension', 'Move it into DimCustomer as a loyalty-tier attribute', 'Yes. A value that describes a customer and repeats across many rows belongs in the customer dimension.'), option('fact', 'Keep it in FactSales next to Revenue', 'Keeping a repeating descriptive attribute in the fact table duplicates it onto every event row and makes grouping harder to reuse.'), option('measure', 'Turn it into a DAX measure', 'The rate is a stored descriptive attribute of the customer, not a calculation over filter context.')],
    answerId: 'dimension', decisiveClue: 'A value that describes an entity and repeats across many transaction rows belongs in a dimension, not duplicated onto every fact row.', remediation: { label: 'Revisit Schema Lab', href: '#/lab/schema' },
  },
  {
    id: 'query-engine-for-warehouse-table', domain: 'Prepare data', objectiveIds: ['PREPARE.QUERY.SQL', 'PREPARE.QUERY.KQL'], title: 'Same question, three engines',
    context: 'An analyst wants total revenue by region for the last 30 days. The rows live in a Warehouse table. A separate Eventhouse holds device ping counts for the same period, and a semantic model has not been built over either yet.',
    question: 'Which language is the closest fit for filtering and aggregating the Warehouse table directly?',
    options: [option('sql', 'T-SQL', 'Yes. Warehouse exposes a relational T-SQL endpoint suited to filtering and aggregating its tables directly.'), option('kql', 'KQL', 'KQL is the query language for Eventhouse and Real-Time Intelligence, not the Warehouse’s relational tables.'), option('dax', 'DAX', 'DAX operates over a semantic model’s relationships and filter context; no semantic model exists yet in this scenario.')],
    answerId: 'sql', decisiveClue: 'The question asks about querying the Warehouse table directly, before any semantic model or event store is involved.', remediation: { label: 'Revisit Query Rosetta', href: '#/lab/query' },
  },
  {
    id: 'direct-lake-guardrail-fallback', domain: 'Implement and manage semantic models', objectiveIds: ['MODEL.OPTIMIZE.DIRECT_LAKE'], title: 'A Direct Lake report suddenly slows down',
    context: 'Aurora’s Direct Lake model over FactSales normally answers queries straight from OneLake. After a data engineer applies many small, frequent Spark updates that push past the guardrail for Parquet row-group counts, report queries become noticeably slower.',
    question: 'What is the most likely explanation for the slowdown?',
    options: [option('fallback', 'The model has fallen back to the SQL analytics endpoint', 'Yes. Exceeding a documented Direct Lake guardrail such as row-group counts triggers fallback to querying through the SQL analytics endpoint.'), option('reimport', 'The model silently switched to a full Import refresh', 'Direct Lake does not convert itself into an Import model; the documented behavior is a query-path fallback, not a refresh-mode change.'), option('rls', 'Row-level security recalculated for every user', 'RLS evaluation is not the documented cause of a guardrail-triggered slowdown.')],
    answerId: 'fallback', decisiveClue: 'Frequent small updates pushing past a Direct Lake guardrail is the specific, documented trigger for SQL-endpoint fallback.', remediation: { label: 'Revisit Direct Lake Engine Room', href: '#/lab/direct-lake' },
  },
  {
    id: 'incremental-refresh-late-arrivals', domain: 'Implement and manage semantic models', objectiveIds: ['MODEL.OPTIMIZE.INCREMENTAL_REFRESH'], title: 'Late-arriving orders in a rolling window',
    context: 'Aurora’s FactSales incremental refresh policy keeps 5 years of history and refreshes only the last 10 days. A distribution partner occasionally reports order corrections up to 20 days after the original sale.',
    question: 'What should Priya change so those late corrections are captured without reprocessing all 5 years?',
    options: [option('widen', 'Increase the refresh (incremental) range to cover at least 20 days', 'Yes. The refresh range must cover the realistic lateness window, independent of how much history is retained.'), option('full', 'Switch to a full refresh of the whole table on every run', 'This reprocesses far more than necessary and undermines the purpose of incremental refresh.'), option('retention', 'Shorten the historical retention window to 20 days', 'Retention controls how much history stays in the table; it does not change whether recent late-arriving rows get refreshed.')],
    answerId: 'widen', decisiveClue: 'The refresh range must cover the realistic lateness window, which is a separate policy from historical retention.', remediation: { label: 'Revisit Incremental Refresh Time Machine', href: '#/lab/incremental-refresh' },
  },
  {
    id: 'calculation-group-time-intelligence', domain: 'Implement and manage semantic models', objectiveIds: ['MODEL.DESIGN.DAX'], title: 'Ten measures, repeated time intelligence',
    context: 'Aurora’s model already defines ten base measures, including Total Sales and Total Cost. Marta now wants a Year-to-Date and Prior-Year version of every one of them, and the modeler wants to avoid writing twenty nearly identical DAX measures.',
    question: 'What is the most direct way to add YTD and Prior-Year variants for every base measure?',
    options: [option('calcgroup', 'Build a calculation group with YTD and Prior-Year calculation items', 'Yes. A calculation group applies the same time-intelligence pattern across every existing and future base measure without duplicating DAX.'), option('duplicate', 'Duplicate each measure and wrap it in the matching time-intelligence function', 'This works but multiplies maintenance for every future base measure, which a calculation group is designed to avoid.'), option('relationship', 'Add a new relationship to a second date-table copy', 'An extra date-table relationship does not by itself produce YTD or Prior-Year variants.')],
    answerId: 'calcgroup', decisiveClue: 'Reusing one time-intelligence pattern across many existing measures without duplicating DAX per measure is the calculation-group scenario.', remediation: { label: 'Revisit Calculation Group Lab', href: '#/lab/calculation-groups' },
  },
];
