'use client';

import { ArrowLeft, Braces, Database, Eye, Filter, Layers3, Sigma, Table2, Waves } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getQueryScenario, queryAccuracyNote, querySurfaceMeta, queryTaskMeta, type QuerySurface, type QueryTask } from '@/engine/query/rosetta';

const surfaces: QuerySurface[] = ['visual', 'sql', 'kql', 'dax'];
const tasks: QueryTask[] = ['filter', 'aggregate', 'group'];
const surfaceIcons = { visual: Eye, sql: Database, kql: Waves, dax: Layers3 };
const taskIcons = { filter: Filter, aggregate: Sigma, group: Table2 };

export function QueryRosetta() {
  const [surface, setSurface] = useState<QuerySurface>('visual');
  const [task, setTask] = useState<QueryTask>('group');
  const scenario = useMemo(() => getQueryScenario(surface, task), [surface, task]);
  const SurfaceIcon = surfaceIcons[surface];

  return <div className="lab-page query-page">
    <header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Query Rosetta</strong><span>Aurora Outfitters · One question, different layers</span></div><span className="simulation-label">Curated comparison</span></header>
    <main className="query-shell">
      <section className="query-controls" aria-labelledby="query-heading"><p className="eyebrow">Query surface</p><h1 id="query-heading">Choose where the work happens</h1><p>The same broad operation changes meaning with its layer. Compare the engine, object, and purpose—not syntax alone.</p><nav className="surface-list" aria-label="Query surfaces">{surfaces.map((id) => { const Icon = surfaceIcons[id]; const meta = querySurfaceMeta[id]; return <button key={id} className={surface === id ? 'active' : ''} onClick={() => setSurface(id)} aria-pressed={surface === id}><Icon /><span><strong>{meta.label}</strong><small>{meta.location}</small></span></button>; })}</nav><aside className="query-layer-note"><SurfaceIcon /><div><span>You are querying</span><strong>{scenario.location}</strong><small>{scenario.language}</small></div></aside></section>
      <section className="query-stage" aria-labelledby="query-scenario-heading"><div className="query-taskbar" aria-label="Conceptual query task">{tasks.map((id) => { const Icon = taskIcons[id]; return <button className={task === id ? 'active' : ''} onClick={() => setTask(id)} key={id}><Icon />{queryTaskMeta[id].label}</button>; })}</div><div className="query-heading"><div><p className="eyebrow">Current comparison</p><h2 id="query-scenario-heading">{scenario.question}</h2></div><span>{scenario.language}</span></div>
        <div className="query-comparison"><section className="query-code"><header><Braces /><div><small>{scenario.location}</small><strong>{surface === 'visual' ? 'Operation canvas' : `${scenario.label} expression`}</strong></div></header><pre><code>{scenario.code}</code></pre>{surface === 'visual' ? <p>The visual editor expresses relational operations and generates T-SQL; it is not a separate execution language.</p> : null}</section><section className="query-result"><header><span>Deterministic result</span><strong>{scenario.result.value}</strong></header><div>{scenario.result.rows.map((row) => { const [name, value] = row.split(' · '); return <article key={row}><span>{name}</span><strong>{value}</strong></article>; })}</div><footer>{scenario.result.label}</footer></section></div>
        <aside className="query-explanation" aria-live="polite"><SurfaceIcon /><div><strong>{scenario.purpose}</strong><p>{surface === 'sql' ? 'T-SQL works over relational tables in the Warehouse. Joins, grouping, and row retrieval are explicit in the query.' : surface === 'kql' ? 'KQL uses a tabular pipeline over event data in a KQL database. Its summarize operator produces a new aggregated table.' : surface === 'dax' ? 'DAX evaluates measures through semantic-model relationships and filter context. It is not a row-retrieval substitute for SQL or KQL.' : 'The visual query editor helps construct a relational query through visible operations, then exposes the generated T-SQL.'}</p><small>{queryAccuracyNote}</small></div></aside>
      </section>
    </main>
  </div>;
}
