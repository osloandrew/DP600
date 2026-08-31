import type { FoundationConceptId } from '@/content/foundations';

export type JourneyId = 'from-question-to-report';

export type JourneyStop = {
  id: string;
  journeyId: JourneyId;
  title: string;
  roleContext: string;
  mission: string;
  watchFor: string[];
  prerequisiteFoundationIds: FoundationConceptId[];
  labHref: string;
  labTitle: string;
  generalRule: string;
  examLens: { objectiveIds: string[]; scenario: string; wording: string };
};

export type Journey = {
  id: JourneyId;
  title: string;
  subtitle: string;
  missionSummary: string;
  stopIds: string[];
};

export const journeys: Record<JourneyId, Journey> = {
  'from-question-to-report': {
    id: 'from-question-to-report',
    title: 'From business question to trusted report',
    subtitle: "Follow Marta's regional sales report from Aurora's source systems to a finished, secured, fast semantic model.",
    missionSummary: "Marta, Aurora's Retail Director, needs a trustworthy regional sales report. You'll follow order #10482 from the source system, choose where the data should live, shape it, model it, calculate over it, secure it, and make it fast.",
    stopIds: [
      'question-orientation', 'choose-store', 'clean-and-shape', 'build-star-schema',
      'model-relationships', 'add-a-measure', 'trace-the-query', 'control-access', 'diagnose-performance',
    ],
  },
};

export const journeyStops: Record<string, JourneyStop> = {
  'question-orientation': {
    id: 'question-orientation', journeyId: 'from-question-to-report',
    title: 'Where does the data begin?',
    roleContext: 'Marta — Retail Director',
    mission: 'Marta wants monthly revenue by region, and she wants to trust the number. Before anything is built, find out where Aurora’s sales data actually starts and how it reaches a report today.',
    watchFor: ['Which system order #10482 exists in before analytics ever touches it.', 'How many Fabric layers the data crosses before it becomes a report visual.'],
    prerequisiteFoundationIds: ['source-to-report-path'],
    labHref: '#explore', labTitle: 'Fabric Atlas',
    generalRule: 'Every report answer traces back through a semantic model, a Fabric store, and ultimately a source system — Fabric doesn’t remove those layers, it organizes them.',
    examLens: {
      objectiveIds: ['PREPARE.GET.CONNECTION', 'PREPARE.GET.INGEST'],
      scenario: 'A scenario describes data that must be "ingested" versus data that is "accessed in place." That distinction is asking whether Fabric copies the source data into a store or reads it where it already lives.',
      wording: 'Watch for "ingest," "connect," "access," and "discover" — they describe different relationships to the same source.',
    },
  },
  'choose-store': {
    id: 'choose-store', journeyId: 'from-question-to-report',
    title: 'Choose where the data should live',
    roleContext: 'Priya — Data Engineer',
    mission: 'Priya needs to land Aurora’s structured transaction data somewhere before it can be shaped into a report. Compare Lakehouse, Warehouse, and Eventhouse against the retail-reporting workload, then see what changes if the workload becomes high-volume telemetry instead.',
    watchFor: ['Which store is a strong fit versus merely possible for structured, T-SQL-heavy retail reporting.', 'What changes about the recommendation when latency and data shape change.'],
    prerequisiteFoundationIds: ['operational-vs-analytical'],
    labHref: '#/lab/data-stores', labTitle: 'Data Store Lab',
    generalRule: 'Store choice follows the workload’s data shape, latency, and query language — not a single "best" store for every job.',
    examLens: {
      objectiveIds: ['PREPARE.GET.STORE_SELECTION'],
      scenario: 'A scenario names a data shape (structured, mixed, streaming), a latency need, and a preferred query language, then asks which store fits. The store names are rarely the hard part — matching the requirements is.',
      wording: 'Watch for "structured relational data," "high-volume events," and "T-SQL" or "KQL" as the deciding clues.',
    },
  },
  'clean-and-shape': {
    id: 'clean-and-shape', journeyId: 'from-question-to-report',
    title: 'Clean and shape the data',
    roleContext: 'Priya — Data Engineer',
    mission: 'The raw order rows have duplicates, a null region, and an inconsistent date format. Marta’s report can’t trust totals until this is fixed. Build a transformation pipeline that gets the data ready.',
    watchFor: ['How the row count and totals change after removing duplicates.', 'What happens to a null Region instead of guessing a value for it.'],
    prerequisiteFoundationIds: ['data-types-and-nulls'],
    labHref: '#/lab/transformation', labTitle: 'Transformation Workbench',
    generalRule: 'Transformation happens once, upstream, so every downstream report inherits clean, consistent data instead of every report re-cleaning it independently.',
    examLens: {
      objectiveIds: ['PREPARE.TRANSFORM.DATA_QUALITY', 'PREPARE.TRANSFORM.DATA_TYPES'],
      scenario: 'A scenario lists several data-quality problems in one source table and asks which operation addresses each one — duplicates, nulls, and type mismatches are usually tested as separate, specific fixes.',
      wording: 'Watch for "duplicate," "missing value," and "incorrect data type" named separately — they call for different transformations.',
    },
  },
  'build-star-schema': {
    id: 'build-star-schema', journeyId: 'from-question-to-report',
    title: 'Build a star schema',
    roleContext: 'Elena — BI Analyst',
    mission: 'The cleaned data is still one wide operational-style table. Elena needs to reshape it into fact and dimension tables so Marta’s report can filter and group efficiently.',
    watchFor: ['Which columns repeat across many rows before the reshape.', 'What FactSales’ grain becomes once the reshape is finished.'],
    prerequisiteFoundationIds: ['fact-and-dimension', 'grain', 'star-schema'],
    labHref: '#/lab/schema', labTitle: 'Schema Lab',
    generalRule: 'A dimension describes business entities used to filter and group; a fact table records measurable events at one defined grain.',
    examLens: {
      objectiveIds: ['PREPARE.TRANSFORM.STAR', 'PREPARE.TRANSFORM.DENORMALIZE'],
      scenario: 'A scenario describes a wide, repetitive source table and asks how to reduce repetition and clarify grain — the answer is separating it into a star schema, not adding more columns.',
      wording: 'Watch for "repeated attributes," "inconsistent grain," and "star schema" as the target shape.',
    },
  },
  'model-relationships': {
    id: 'model-relationships', journeyId: 'from-question-to-report',
    title: 'Model the relationships',
    roleContext: 'Elena — BI Analyst',
    mission: 'FactSales and its dimensions exist, but nothing connects them yet. Wire up the relationships, then see what happens when a relationship becomes bidirectional or when two fact tables are related directly instead of through a shared dimension.',
    watchFor: ['Which direction a filter travels once you select a region.', 'What becomes ambiguous when you deliberately make a relationship bidirectional.'],
    prerequisiteFoundationIds: ['cardinality', 'filter-direction'],
    labHref: '#/lab/relationships', labTitle: 'Relationship Lab',
    generalRule: 'Relationships should usually be single-direction and one-to-many through a shared dimension; bidirectional and many-to-many paths need a deliberate reason, like a bridge table.',
    examLens: {
      objectiveIds: ['MODEL.DESIGN.RELATIONSHIPS'],
      scenario: 'A scenario describes entities that can each relate to several of the other, like customers and shared accounts, and asks how to model it without duplicating facts — that’s a bridge-table pattern.',
      wording: 'Watch for "many-to-many," "ambiguous," and "bridge table" as related clues pointing at the same design decision.',
    },
  },
  'add-a-measure': {
    id: 'add-a-measure', journeyId: 'from-question-to-report',
    title: 'Add a measure',
    roleContext: 'Elena — BI Analyst',
    mission: 'Marta’s report already totals all sales. Now she wants Bike sales specifically, but the number still has to respect whatever region the report reader has selected. Step through the DAX that makes that happen.',
    watchFor: ['What the existing filter context looks like before CALCULATE runs.', 'Which filter CALCULATE adds, and which filter it leaves alone.'],
    prerequisiteFoundationIds: ['transform-query-calculate', 'filter-direction'],
    labHref: '#/lab/dax', labTitle: 'DAX Microscope',
    generalRule: 'CALCULATE modifies filter context by adding or replacing specific filters — it does not clear filters it wasn’t told to touch.',
    examLens: {
      objectiveIds: ['PREPARE.QUERY.DAX', 'MODEL.DESIGN.DAX'],
      scenario: 'A scenario gives a measure and asks what result it returns under a stated report filter — the answer depends on tracing exactly which filters are active after CALCULATE runs, not on memorizing the function.',
      wording: 'Watch for "filter context," "evaluation context," and named filters that CALCULATE would add or remove.',
    },
  },
  'trace-the-query': {
    id: 'trace-the-query', journeyId: 'from-question-to-report',
    title: 'Trace the report query',
    roleContext: 'Elena — BI Analyst',
    mission: 'The model works. Now find out what actually happens when Marta opens the report: does it read from memory, query the Warehouse live, or load Delta columns straight from OneLake? Compare Import, DirectQuery, Dual, and Direct Lake on the same query.',
    watchFor: ['Whether the query path reaches all the way back to the source, or stops at an in-memory cache.', 'What changes about freshness and query cost between modes.'],
    prerequisiteFoundationIds: ['refresh-cache-live-query'],
    labHref: '#/lab/storage-modes', labTitle: 'Storage Mode Lab',
    generalRule: 'Storage mode decides whether a report reads a scheduled in-memory copy, queries the source live, or loads required columns directly from OneLake — each has a different freshness and performance tradeoff.',
    examLens: {
      objectiveIds: ['MODEL.DESIGN.STORAGE', 'MODEL.OPTIMIZE.DIRECT_LAKE'],
      scenario: 'A scenario needs near-real-time data over very large OneLake tables without a traditional import refresh — that combination of clues points at Direct Lake, not Import or DirectQuery alone.',
      wording: 'Watch for "large Delta tables," "avoid a full refresh," and "interactive performance" appearing together.',
    },
  },
  'control-access': {
    id: 'control-access', journeyId: 'from-question-to-report',
    title: 'Control who sees what',
    roleContext: 'Leila — Platform Admin',
    mission: 'Jonas manages Norway sales and should never see Sweden’s numbers. Configure the right layer of security so the same report shows different rows to different people, without duplicating the model.',
    watchFor: ['Which layer — workspace, item, or row — actually removes Sweden’s rows for Jonas.', 'What switching identity changes everywhere at once.'],
    prerequisiteFoundationIds: ['workspace-and-items', 'filter-direction'],
    labHref: '#/lab/security', labTitle: 'Security Lens',
    generalRule: 'Workspace and item permissions control what someone can open; row-level security controls what they see once inside — they are different layers, not interchangeable settings.',
    examLens: {
      objectiveIds: ['MAINTAIN.SECURITY.WORKSPACE', 'MAINTAIN.SECURITY.ROW'],
      scenario: 'A scenario says a user can open a report but must never see certain rows — that is RLS, not a workspace or item permission change, even though all three are called "security."',
      wording: 'Watch for which layer the requirement names: "workspace," "item," "row," "column," or "object."',
    },
  },
  'diagnose-performance': {
    id: 'diagnose-performance', journeyId: 'from-question-to-report',
    title: 'Diagnose a performance problem',
    roleContext: 'Oskar — Finance Analyst',
    mission: 'Oskar’s finance report is slow. Use the same model and find out why, then make one change at a time and watch simulated query duration and engine work respond.',
    watchFor: ['Which single change produces the largest simulated improvement.', 'Why the fix works, not just that the number went down.'],
    prerequisiteFoundationIds: ['star-schema', 'refresh-cache-live-query'],
    labHref: '#/lab/performance', labTitle: 'Performance Lab',
    generalRule: 'Performance problems usually trace back to an earlier decision — cardinality, calculated columns instead of measures, relationship direction, or storage mode — rather than needing a different report design.',
    examLens: {
      objectiveIds: ['MODEL.OPTIMIZE.QUERY', 'MODEL.OPTIMIZE.DAX'],
      scenario: 'A scenario describes a slow report and several candidate causes; the exam wants you to identify the root modeling decision responsible, not just recommend "optimize the report."',
      wording: 'Watch for "high-cardinality column," "calculated column," "iterator," and "aggregation table" as the actual levers.',
    },
  },
};
