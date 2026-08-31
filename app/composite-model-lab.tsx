'use client';

import { ArrowLeft, BookOpen, Database, FileSpreadsheet, Layers3, Network, Play, ServerCog, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { compositeAccuracyNote, compositeTables, evaluateCompositeModel, type CompositeQuery, type DimensionMode } from '@/engine/composite-model/model';

const queries: { id: CompositeQuery; title: string; detail: string }[] = [
  { id: 'product-slicer', title: 'Product slicer', detail: 'DimProduct only' },
  { id: 'sales-by-product', title: 'Revenue by product', detail: 'Dimension + DirectQuery fact' },
  { id: 'target-variance', title: 'Sales versus target', detail: 'Warehouse + local import' },
];

export function CompositeModelLab() {
  const [mode, setMode] = useState<DimensionMode>('import');
  const [query, setQuery] = useState<CompositeQuery>('sales-by-product');
  const [run, setRun] = useState(false);
  const result = useMemo(() => evaluateCompositeModel(mode, query), [mode, query]);
  const changeQuery = (next: CompositeQuery) => { setQuery(next); setRun(false); };
  return <div className="lab-page composite-page"><header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Composite Model Lab</strong><span>Aurora Outfitters · Mixed storage</span></div><span className="simulation-label">Source-group simulator</span></header><main className="composite-shell">
    <section className="composite-controls" aria-labelledby="composite-title"><p className="eyebrow">Mixed-storage model</p><h1 id="composite-title">See which source groups participate</h1><p>Change DimProduct between Import and Dual, then run queries that touch cache, warehouse, or both.</p><fieldset><legend>DimProduct storage mode</legend><button className={mode === 'import' ? 'active' : ''} onClick={() => { setMode('import'); setRun(false); }}><Layers3 />Import</button><button className={mode === 'dual' ? 'active' : ''} onClick={() => { setMode('dual'); setRun(false); }}><Network />Dual</button></fieldset><fieldset className="composite-query-list"><legend>Report query</legend>{queries.map((item) => <button aria-label={`${item.title}: ${item.detail}`} className={query === item.id ? 'active' : ''} key={item.id} onClick={() => changeQuery(item.id)}><span><strong>{item.title}</strong><small>{item.detail}</small></span></button>)}</fieldset><button className="composite-run" onClick={() => setRun(true)}><Play />Run selected query</button><aside><ShieldAlert /><div><strong>Source groups matter</strong><p>Relationships crossing Import and DirectQuery groups are limited even when their displayed cardinality looks familiar.</p></div></aside></section>
    <section className="composite-stage" aria-labelledby="composite-stage-title"><div className="composite-heading"><div><p className="eyebrow">Live model</p><h2 id="composite-stage-title">{run ? result.path : 'Waiting for a report query'}</h2></div><span>{run ? result.relationship : 'Path preview'}</span></div><div className="composite-model">{compositeTables.map((table) => { const active = run && result.activeTables.includes(table.id); const tableMode = table.id === 'product' || table.id === 'date' ? mode === 'dual' ? 'Dual' : 'Import' : table.id === 'sales' ? 'DirectQuery' : 'Import'; return <article className={`${active ? 'is-active' : ''} table-${table.id}`} key={table.id}><span>{table.id === 'targets' ? <FileSpreadsheet /> : table.id === 'sales' ? <ServerCog /> : <Database />}</span><div><small>{table.source}</small><strong>{table.title}</strong><p>{table.rows} rows</p></div><b>{tableMode}</b></article>; })}<div className={`model-link link-product-sales ${run && result.activeTables.includes('sales') ? 'is-active' : ''}`}><span>{mode === 'dual' ? 'Regular' : 'Limited'}</span></div><div className={`model-link link-targets-sales ${run && query === 'target-variance' ? 'is-active' : ''}`}><span>Limited</span></div></div>
      <section className="composite-route"><div><Layers3 /><span><small>Model cache</small><strong>{run && (query === 'product-slicer' || query === 'target-variance' || mode === 'import') ? 'Participates' : 'Not used'}</strong></span></div><b>+</b><div><ServerCog /><span><small>Warehouse DirectQuery</small><strong>{run && query !== 'product-slicer' ? `${result.nativeQueries} native query` : 'Not queried'}</strong></span></div></section><aside className="composite-observation" aria-live="polite"><Network /><div><strong>{run ? result.relationship : 'Run the query to reveal its boundary'}</strong><p>{run ? result.explanation : 'Active tables, source groups, and relationship type will highlight together.'}</p><small>{compositeAccuracyNote}</small></div></aside><footer className="security-source"><span>Current behavior verified with Microsoft Learn</span><a href="https://learn.microsoft.com/en-us/power-bi/guidance/composite-model-guidance" target="_blank" rel="noreferrer"><BookOpen />Composite model guidance</a></footer>
    </section>
  </main></div>;
}
