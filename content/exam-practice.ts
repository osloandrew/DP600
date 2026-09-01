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
];
