'use client';

import { ArrowDown, ArrowLeft, ArrowRight, Database, ExternalLink, FileChartColumn, Gauge, HardDrive, Layers3, Play, RefreshCw, RotateCcw, ServerCog, SlidersHorizontal } from 'lucide-react';
import { useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { describeStorageMode, initialStorageModeState, reduceStorageMode, storageModeAccuracyNote, type PathStep, type StorageMode, type StorageQuery } from '@/engine/storage-modes/model';

const modes: { id: StorageMode; title: string; subtitle: string }[] = [
  { id: 'import', title: 'Import', subtitle: 'Copied at refresh' },
  { id: 'direct-query', title: 'DirectQuery', subtitle: 'Source at query time' },
  { id: 'dual', title: 'Dual', subtitle: 'Cache or source' },
  { id: 'direct-lake', title: 'Direct Lake', subtitle: 'Delta in OneLake' },
];

const stepIcons = { report: FileChartColumn, model: Layers3, memory: HardDrive, source: Database };

function PathCard({ step, active }: { step: PathStep; active: boolean }) {
  const Icon = stepIcons[step.id];
  return <article className={`storage-path-card path-${step.id} ${active ? 'is-active' : ''}`}><span><Icon /></span><div><small>{step.eyebrow}</small><strong>{step.title}</strong><p>{step.detail}</p></div></article>;
}

export function StorageModeLab() {
  const [state, dispatch] = useReducer(reduceStorageMode, initialStorageModeState);
  const outcome = describeStorageMode(state);
  const hasRun = state.runCount > 0;
  const setMode = (mode: StorageMode) => dispatch({ type: 'set-mode', mode });
  const setQuery = (query: StorageQuery) => dispatch({ type: 'set-query', query });

  return <div className="lab-page storage-mode-page"><header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Storage Mode Lab</strong><span>Aurora Outfitters · Sales semantic model</span></div><span className="simulation-label">Query-path simulator</span></header><main className="storage-mode-shell">
    <section className="storage-mode-controls" aria-labelledby="storage-mode-heading"><p className="eyebrow">Semantic model design</p><h1 id="storage-mode-heading">Reroute the same report query</h1><p>Choose how tables store and reach data. Then change the source and see which path notices.</p><fieldset className="storage-mode-list"><legend>Storage mode</legend>{modes.map((mode) => <button key={mode.id} className={state.mode === mode.id ? 'active' : ''} onClick={() => setMode(mode.id)}><span>{mode.id === 'import' ? <HardDrive /> : mode.id === 'direct-query' ? <ServerCog /> : mode.id === 'dual' ? <SlidersHorizontal /> : <Database />}</span><strong>{mode.title}</strong><small>{mode.subtitle}</small></button>)}</fieldset>
      <fieldset className="storage-query-list"><legend>Report query</legend><button className={state.query === 'product-slicer' ? 'active' : ''} onClick={() => setQuery('product-slicer')}><strong>Product slicer</strong><small>DimProduct only</small></button><button className={state.query === 'revenue-by-category' ? 'active' : ''} onClick={() => setQuery('revenue-by-category')}><strong>Revenue by category</strong><small>DimProduct + FactSales</small></button></fieldset>
      <div className="storage-mode-actions"><Button onClick={() => dispatch({ type: 'run-query' })}><Play />Run report query</Button><Button variant="outline" onClick={() => dispatch({ type: 'change-source' })}><Database />Change source data</Button><Button variant="outline" onClick={() => dispatch({ type: 'refresh-cache' })} disabled={!outcome.refreshAvailable}><RefreshCw />Refresh copied data</Button><Button variant="ghost" onClick={() => dispatch({ type: 'reset' })}><RotateCcw />Reset lab</Button></div>
      <aside className="storage-source-state"><Database /><div><strong>Warehouse source · v{state.sourceVersion}</strong><p>{state.cacheVersion === state.sourceVersion ? `Imported caches are aligned at v${state.cacheVersion}.` : `Imported caches remain at v${state.cacheVersion}.`}</p></div></aside>
    </section>
    <section className="storage-mode-stage" aria-labelledby="storage-path-heading"><div className="storage-mode-heading"><div><p className="eyebrow">Observed execution</p><h2 id="storage-path-heading">{hasRun ? outcome.title : 'Choose a path, then run the query'}</h2></div><span className={outcome.cacheIsStale ? 'is-stale' : ''}>{hasRun ? outcome.behavior : 'Ready'}</span></div>
      <div className={`storage-path mode-${state.mode} ${hasRun ? 'has-run' : ''}`} aria-label="Query execution path">{outcome.steps.map((step, index) => <div className="storage-path-step" key={`${step.id}-${index}`}><PathCard step={step} active={hasRun} />{index < outcome.steps.length - 1 ? <ArrowDown aria-hidden="true" /> : null}</div>)}</div>
      <div className="storage-observation" aria-live="polite"><Gauge /><div><strong>{hasRun ? `Result observes data v${outcome.observedVersion}` : 'The route is previewed above'}</strong><p>{hasRun ? outcome.explanation : 'Run the report query to animate the selected mode’s serving path and inspect its consequence.'}</p><small>{storageModeAccuracyNote}</small></div></div>
      <div className="storage-mode-facts"><article><span>Table data copied into model?</span><strong>{state.mode === 'import' ? 'Yes' : state.mode === 'dual' ? 'Dimension cache' : 'No'}</strong></article><article><span>Native source query for this request?</span><strong>{hasRun ? outcome.nativeQuery ? 'Yes' : 'No' : '—'}</strong></article><article><span>Freshness after source change</span><strong>{state.mode === 'import' ? 'After refresh' : state.mode === 'dual' ? 'Depends on query' : 'At query time'}</strong></article></div>
      {state.mode === 'direct-lake' ? <a className="storage-engine-link" href="#/lab/direct-lake"><span><Database /><span><strong>Open the Direct Lake Engine Room</strong><small>Inspect column loading, framing, and SQL-endpoint fallback.</small></span></span><ArrowRight /></a> : null}
      <footer className="storage-mode-source"><span>Terminology verified with Microsoft Learn</span><a href="https://learn.microsoft.com/en-us/power-bi/connect-data/service-dataset-modes-understand" target="_blank" rel="noreferrer">Semantic model modes <ExternalLink /></a></footer>
    </section>
  </main></div>;
}
