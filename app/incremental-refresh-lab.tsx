'use client';

import { ArrowLeft, CalendarRange, Database, ExternalLink, History, Play, RefreshCw, RotateCcw, ServerCog } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { evaluateIncrementalRefresh, incrementalAccuracyNote, type IncrementalPolicy } from '@/engine/incremental-refresh/model';

export function IncrementalRefreshLab() {
  const [policy, setPolicy] = useState<IncrementalPolicy>({ storeMonths: 12, refreshDays: 7, realtime: false });
  const [lateChange, setLateChange] = useState(false);
  const [refreshRun, setRefreshRun] = useState(false);
  const outcome = useMemo(() => evaluateIncrementalRefresh(policy, '2026-08-31', lateChange, refreshRun), [policy, lateChange, refreshRun]);
  const updatePolicy = (next: Partial<IncrementalPolicy>) => { setPolicy((current) => ({ ...current, ...next })); setRefreshRun(false); };
  const reset = () => { setPolicy({ storeMonths: 12, refreshDays: 7, realtime: false }); setLateChange(false); setRefreshRun(false); };

  return <div className="lab-page incremental-page"><header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Incremental Refresh Time Machine</strong><span>Aurora Outfitters · FactSales</span></div><span className="simulation-label">Rolling-window model</span></header><main className="incremental-shell">
    <section className="incremental-controls" aria-labelledby="incremental-title"><p className="eyebrow">Refresh policy</p><h1 id="incremental-title">Move the partition boundaries</h1><p>Define what the model stores and reprocesses. Then correct an older order and see whether the next refresh catches it.</p>
      <fieldset><legend>Archive data for</legend><div>{([12, 24] as const).map((months) => <button key={months} className={policy.storeMonths === months ? 'active' : ''} onClick={() => updatePolicy({ storeMonths: months })}>{months} months</button>)}</div></fieldset>
      <fieldset><legend>Refresh the last</legend><div>{([7, 30, 60] as const).map((days) => <button key={days} className={policy.refreshDays === days ? 'active' : ''} onClick={() => updatePolicy({ refreshDays: days })}>{days} days</button>)}</div></fieldset>
      <label className="realtime-toggle"><input type="checkbox" checked={policy.realtime} onChange={(event) => updatePolicy({ realtime: event.target.checked })} /><span><ServerCog /><span><strong>Latest data with DirectQuery</strong><small>Add a real-time partition · Premium only</small></span></span></label>
      <div className="incremental-actions"><Button variant="outline" onClick={() => { setLateChange(true); setRefreshRun(false); }} disabled={lateChange}><Database />Correct 12 Aug order</Button><Button onClick={() => setRefreshRun(true)} disabled={refreshRun}><Play />Run refresh</Button><Button variant="ghost" onClick={reset}><RotateCcw />Reset policy</Button></div>
      <aside><CalendarRange /><div><strong>RangeStart / RangeEnd</strong><p>Reserved, case-sensitive Date/Time parameters filter each service-managed partition. Use one inclusive boundary and one exclusive boundary to avoid duplicates.</p></div></aside>
    </section>
    <section className="incremental-stage" aria-labelledby="partition-title"><div className="incremental-heading"><div><p className="eyebrow">31 Aug 2026 refresh</p><h2 id="partition-title">{refreshRun ? 'Only the active window was processed' : 'Policy becomes a rolling partition map'}</h2></div><span>{policy.refreshDays}-day window</span></div>
      <div className="partition-map">{outcome.partitions.map((partition) => <article key={partition.id} className={`partition partition-${partition.kind} ${partition.processed ? 'is-processed' : ''}`}><span>{partition.kind === 'historical' ? <History /> : partition.kind === 'refresh' ? <RefreshCw /> : <ServerCog />}</span><div><small>{partition.kind === 'historical' ? 'Import · unchanged' : partition.kind === 'refresh' ? 'Import · refreshed' : 'DirectQuery'}</small><strong>{partition.label}</strong><p>{partition.range}</p></div>{partition.processed ? <b>Processed now</b> : null}</article>)}</div>
      <div className="incremental-boundaries"><article><span>Stored from</span><strong>{outcome.archiveStart}</strong></article><article><span>Refreshed from</span><strong>{outcome.refreshStart}</strong></article><article><span>Partitions processed now</span><strong>{refreshRun ? '1 grouped window' : 'None yet'}</strong></article></div>
      <section className={`late-change ${lateChange ? 'has-change' : ''}`}><div><Database /><span><small>Order #10482 · 12 Aug 2026</small><strong>Source ${outcome.sourceRevenue.toLocaleString()} → model ${outcome.visibleRevenue.toLocaleString()}</strong></span></div><b>{!lateChange ? 'Aligned' : !refreshRun ? 'Waiting for refresh' : outcome.lateChangeCovered ? 'Correction captured' : 'Still stale'}</b></section>
      <aside className={`incremental-observation ${lateChange && refreshRun && !outcome.lateChangeCovered ? 'is-warning' : ''}`} aria-live="polite"><RefreshCw /><div><strong>{outcome.lateChangeCovered ? 'Change is inside the boundary' : 'Watch the refresh boundary'}</strong><p>{outcome.explanation}</p><small>{incrementalAccuracyNote}</small></div></aside>
      <footer className="storage-mode-source"><span>Policy behavior verified with Microsoft Learn</span><a href="https://learn.microsoft.com/en-us/power-bi/connect-data/incremental-refresh-overview" target="_blank" rel="noreferrer">Incremental refresh overview <ExternalLink /></a></footer>
    </section>
  </main></div>;
}
