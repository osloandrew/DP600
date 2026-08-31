'use client';

import { ArrowDown, ArrowLeft, Database, HardDrive, Layers3, Play, RefreshCw, RotateCcw, ServerCog, ShieldAlert, Table2 } from 'lucide-react';
import { useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { describeDirectLake, directLakeColumns, initialDirectLakeState, reduceDirectLake, type DirectLakeQuery } from '@/engine/direct-lake/model';

const queryLabels: Record<DirectLakeQuery, string> = {
  'sales-by-category': 'Revenue by category',
  'sales-by-region': 'Revenue by region',
};

export function DirectLakeLab() {
  const [state, dispatch] = useReducer(reduceDirectLake, initialDirectLakeState);
  const isStale = state.dataVersion !== state.framedVersion;
  const fallbackActive = state.servingPath === 'direct-query';

  return <div className="lab-page direct-lake-page">
    <header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Direct Lake Engine Room</strong><span>Aurora Outfitters · Sales semantic model</span></div><span className="simulation-label">Deterministic simulation</span></header>
    <main className="direct-lake-workbench">
      <section className="direct-lake-controls" aria-labelledby="direct-lake-heading">
        <p className="eyebrow">Storage path</p><h1 id="direct-lake-heading">See how a query reaches Delta data</h1><p>Run two visuals, change the underlying table, and compare the two Direct Lake variants.</p>
        <fieldset className="direct-lake-mode"><legend>Direct Lake variant</legend><button className={state.mode === 'onelake' ? 'active' : ''} onClick={() => dispatch({ type: 'set-mode', mode: 'onelake' })}><Layers3 />On OneLake<small>No DirectQuery fallback</small></button><button className={state.mode === 'sql-endpoint' ? 'active' : ''} onClick={() => dispatch({ type: 'set-mode', mode: 'sql-endpoint' })}><ServerCog />On SQL endpoint<small>Fallback can occur</small></button></fieldset>
        <div className="direct-lake-actions"><p className="eyebrow">Experiments</p><Button onClick={() => dispatch({ type: 'run-query', query: 'sales-by-category' })}><Play />Run first query</Button><Button variant="outline" onClick={() => dispatch({ type: 'run-query', query: 'sales-by-region' })}><Play />Run second query</Button><Button variant="outline" onClick={() => dispatch({ type: 'change-data' })}><Database />Change Delta data</Button><Button variant="outline" onClick={() => dispatch({ type: 'refresh-frame' })} disabled={!isStale}><RefreshCw />Refresh framing</Button><Button variant={state.fallbackCondition ? 'destructive' : 'outline'} onClick={() => dispatch({ type: 'toggle-fallback-condition' })} disabled={state.mode === 'onelake'}><ShieldAlert />{state.fallbackCondition ? 'Remove SQL RLS' : 'Add SQL RLS'}</Button><Button variant="ghost" onClick={() => dispatch({ type: 'reset' })}><RotateCcw />Reset experiment</Button></div>
        <aside className="direct-lake-rule"><strong>{state.mode === 'onelake' ? 'Direct Lake on OneLake' : 'Direct Lake on SQL analytics endpoint'}</strong><p>{state.mode === 'onelake' ? 'Reads Delta tables through OneLake APIs. It does not switch to DirectQuery through a SQL endpoint.' : 'Normally loads Delta columns directly, but this variant can use DirectQuery when a curated fallback condition is present.'}</p><small>Automatic updates are normally enabled. This lab pauses after a data change so you can inspect framing; its refresh clears the changed FactSales representation while preserving unchanged dimension columns.</small></aside>
      </section>

      <section className="direct-lake-stage" aria-labelledby="engine-heading">
        <div className="direct-lake-heading"><div><p className="eyebrow">Live execution path</p><h2 id="engine-heading">{state.lastQuery ? queryLabels[state.lastQuery] : 'Waiting for a report query'}</h2></div><span className={`path-badge path-${state.servingPath}`}>{state.servingPath === 'idle' ? 'Idle' : state.servingPath === 'direct-lake' ? 'Direct Lake' : 'DirectQuery fallback'}</span></div>
        <div className={`engine-stack ${fallbackActive ? 'has-fallback' : ''}`}>
          <article className="engine-layer report-layer"><span><Table2 /></span><div><small>Report visual</small><strong>{state.lastQuery ? queryLabels[state.lastQuery] : 'Select an experiment'}</strong></div></article><ArrowDown className="engine-arrow" />
          <article className="engine-layer model-layer"><span><Layers3 /></span><div><small>Semantic model</small><strong>Sales model · frame v{state.framedVersion}</strong></div></article><ArrowDown className="engine-arrow normal-arrow" />
          <section className="column-cache" aria-label="In-memory column cache"><header><div><HardDrive /><span><small>In-memory column cache</small><strong>{state.loadedColumns.length} of {directLakeColumns.length} columns loaded</strong></span></div><b>{state.newlyLoadedColumns.length ? `+${state.newlyLoadedColumns.length} now` : 'Reusable'}</b></header><div className="column-grid">{directLakeColumns.map((column) => { const loaded = state.loadedColumns.includes(column.id); const fresh = state.newlyLoadedColumns.includes(column.id); return <div key={column.id} className={`${loaded ? 'is-loaded' : ''} ${fresh ? 'is-new' : ''}`}><span>{column.table}</span><strong>{column.label}</strong><small>{fresh ? 'Loaded now' : loaded ? 'In memory' : 'Not requested'}</small></div>; })}</div></section>
          <ArrowDown className="engine-arrow normal-arrow" /><article className="engine-layer onelake-layer"><span><Database /></span><div><small>OneLake · Delta / Parquet</small><strong>Sales tables · data v{state.dataVersion}</strong></div><i className={isStale ? 'is-stale' : ''}>{isStale ? 'Changed · frame refresh needed' : 'Frame is current'}</i></article>
          <div className="fallback-route" aria-hidden={!fallbackActive}><ArrowDown /><article><ServerCog /><div><small>DirectQuery</small><strong>SQL analytics endpoint</strong></div></article></div>
        </div>
        <aside className={`direct-lake-observation ${fallbackActive ? 'is-warning' : ''}`} aria-live="polite"><strong>{fallbackActive ? 'Normal Direct Lake path bypassed' : isStale ? 'Data state changed' : 'What just happened?'}</strong><p>{describeDirectLake(state)}</p></aside>
      </section>
    </main>
  </div>;
}
