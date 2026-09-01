import type { FoundationConceptId } from '@/content/foundations';

export type JourneyId = 'from-question-to-report' | 'scaling-the-model';

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
  'scaling-the-model': {
    id: 'scaling-the-model',
    title: "Scaling Aurora's model for production",
    subtitle: "Marta's report works. Now make it survive a changing customer, real data volume, repetitive measures, flexible readers, and an outside data source.",
    missionSummary: "The first report is live, but production reality is messier. You'll keep history honest when a customer moves, scale the model onto Direct Lake, collapse repetitive time-intelligence measures into a calculation group, let report readers swap fields on the fly, and blend in Finance's external planning data without losing control of the model.",
    stopIds: [
      'version-history', 'scale-with-direct-lake', 'reusable-time-intelligence', 'flexible-report-views', 'blend-external-data',
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
  'version-history': {
    id: 'version-history', journeyId: 'scaling-the-model',
    title: 'Keep history honest when a customer moves',
    roleContext: 'Elena — BI Analyst',
    mission: 'Customer 812, Ava, moves from Oslo to Bergen on 1 June. Marta’s February report should still say Oslo; a July report should say Bergen. Decide how DimCustomer should handle the change, then process it and compare both months.',
    watchFor: ['What happens to the February sale once a Type 1 overwrite processes the move.', 'How many DimCustomer rows exist for Ava after a Type 2 change, and what makes each one distinct.'],
    prerequisiteFoundationIds: ['keys-and-uniqueness'],
    labHref: '#/lab/scd', labTitle: 'SCD Time Machine',
    generalRule: 'Type 1 overwrites a dimension member and rewrites history under the current value; Type 2 preserves history by inserting a new version with its own surrogate key while the business key stays the same.',
    examLens: {
      objectiveIds: ['PREPARE.TRANSFORM.SCD'],
      scenario: 'A scenario requires historical reports to keep showing the value that was true at the time of the transaction. That is a Type 2 requirement — a Type 1 overwrite would silently corrupt the historical view.',
      wording: 'Watch for "preserve history," "point-in-time," and "as of the transaction date" — they signal Type 2, not Type 1.',
    },
  },
  'scale-with-direct-lake': {
    id: 'scale-with-direct-lake', journeyId: 'scaling-the-model',
    title: 'Scale onto Direct Lake',
    roleContext: 'Priya — Data Engineer',
    mission: 'FactSales has grown too large for a comfortable full Import refresh. Move the model onto Direct Lake, run a couple of report queries, then change the underlying Delta data and see what "framing" means before you refresh it.',
    watchFor: ['How many columns load into memory the first time you run a query, versus the second.', 'What the data version and frame version show after you change the Delta data but before you refresh framing.'],
    prerequisiteFoundationIds: ['refresh-cache-live-query'],
    labHref: '#/lab/direct-lake', labTitle: 'Direct Lake Engine Room',
    generalRule: 'Direct Lake loads only the Delta columns a query actually needs into an in-memory cache, and a framing operation is what advances the model to new data — changing files in OneLake alone does not move the frame forward.',
    examLens: {
      objectiveIds: ['MODEL.OPTIMIZE.DIRECT_LAKE'],
      scenario: 'A scenario describes changed OneLake data that a Direct Lake report does not yet reflect. The fix is triggering a frame refresh, not assuming Direct Lake re-reads files live on every request.',
      wording: 'Watch for "changed Delta files," "still shows old values," and "framing" pointing at the reframe step, not a fallback problem.',
    },
  },
  'reusable-time-intelligence': {
    id: 'reusable-time-intelligence', journeyId: 'scaling-the-model',
    title: 'Collapse repetitive time-intelligence measures',
    roleContext: 'Elena — BI Analyst',
    mission: 'Marta now wants Year-to-Date and Prior-Year versions of Sales, Margin, and Orders. See what twelve separately authored measures would take, then collapse them into one calculation group with reusable calculation items.',
    watchFor: ['How the same calculation item’s expression stays identical while the base measure underneath it changes.', 'What SELECTEDMEASURE() is standing in for once the calculation group is introduced.'],
    prerequisiteFoundationIds: ['transform-query-calculate'],
    labHref: '#/lab/calculation-groups', labTitle: 'Calculation Group Lab',
    generalRule: 'A calculation group applies one authored calculation item to whichever explicit measure is currently selected, so adding a new base measure never requires writing new time-intelligence DAX for it.',
    examLens: {
      objectiveIds: ['MODEL.DESIGN.DAX'],
      scenario: 'A scenario describes many base measures each needing the same handful of variants — YTD, Prior-Year, and so on — and asks how to avoid duplicating DAX for every combination. That is the calculation-group pattern, built around SELECTEDMEASURE().',
      wording: 'Watch for "repeated variants across many measures" and "SELECTEDMEASURE" as the calculation-group signal.',
    },
  },
  'flexible-report-views': {
    id: 'flexible-report-views', journeyId: 'scaling-the-model',
    title: 'Let report readers swap fields on the fly',
    roleContext: 'Marta — Retail Director',
    mission: 'Marta wants to flip one chart between Category, Brand, Region, or Store, and between Revenue, Margin, or Orders, without asking Elena to build a new page each time. Try both parameters and read what actually changed in the visual’s field wells.',
    watchFor: ['Whether changing a field parameter changes the chart type, or only which fields feed it.', 'What NAMEOF is doing inside the Axis and Measure parameter definitions.'],
    prerequisiteFoundationIds: ['tables-rows-columns'],
    labHref: '#/lab/field-parameters', labTitle: 'Field Parameter Explorer',
    generalRule: 'A field parameter is a small table of field references a report reader can pick from; selecting one swaps which column or measure occupies a visual’s field well, not the values inside that field.',
    examLens: {
      objectiveIds: ['MODEL.CONFIGURE.FIELD_PARAMETERS'],
      scenario: 'A scenario needs a report reader to switch which dimension or measure a visual uses, without duplicating the report or filtering values inside one fixed field. That distinction points at a field parameter, not an ordinary slicer.',
      wording: 'Watch for "switch which field a visual uses," which is a field parameter, versus "filter which values appear," which is an ordinary slicer.',
    },
  },
  'blend-external-data': {
    id: 'blend-external-data', journeyId: 'scaling-the-model',
    title: 'Blend in an outside data source',
    roleContext: 'Priya — Data Engineer',
    mission: 'Finance keeps sales targets in a spreadsheet imported locally, while FactSales stays in DirectQuery against the Warehouse. Run a query that only touches DimProduct, then one that compares sales to target, and see which source groups actually get touched each time.',
    watchFor: ['Which storage mode DimProduct needs before a relationship between an Import table and a DirectQuery fact table behaves normally.', 'Why the model cache and the Warehouse can both be queried for the same visual.'],
    prerequisiteFoundationIds: ['refresh-cache-live-query'],
    labHref: '#/lab/composite-models', labTitle: 'Composite Model Lab',
    generalRule: 'A composite model can mix Import, DirectQuery, and Direct Lake tables from different source groups in one model, but a relationship crossing an Import table and a DirectQuery table stays limited unless the Import-side table uses Dual storage mode.',
    examLens: {
      objectiveIds: ['MODEL.DESIGN.RELATIONSHIPS'],
      scenario: 'A scenario combines a locally imported spreadsheet with a live DirectQuery fact table and reports an unexpected relationship limitation. The fix is switching the shared dimension to Dual mode, not abandoning the composite model.',
      wording: 'Watch for "limited relationship," "different source groups," and "Dual" appearing together — that combination is the composite-model tell.',
    },
  },
};
