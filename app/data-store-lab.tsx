'use client';

import { ArrowLeft, Boxes, Database, ServerCog, Waves } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { evaluateStores, type WorkloadProfile } from '@/engine/data-stores/fit';

const options = {
  dataForm: [['structured', 'Structured'], ['mixed', 'Mixed'], ['streaming', 'Streaming']],
  language: [['sql', 'SQL'], ['spark', 'Spark'], ['kql', 'KQL']],
  latency: [['batch', 'Batch'], ['near-real-time', 'Near real-time'], ['real-time', 'Real-time']],
  workload: [['bi', 'BI reporting'], ['engineering', 'Data engineering'], ['telemetry', 'Telemetry']],
} as const;

const stores = {
  lakehouse: { title: 'Lakehouse', icon: Boxes, description: 'Open Delta tables and files with Spark plus a SQL analytics endpoint.', engine: 'Spark + SQL', representation: 'Delta / Parquet' },
  warehouse: { title: 'Warehouse', icon: ServerCog, description: 'Structured relational analytics with full warehouse-style T-SQL.', engine: 'T-SQL', representation: 'Relational tables' },
  eventhouse: { title: 'Eventhouse', icon: Waves, description: 'High-volume event and telemetry analysis built around KQL.', engine: 'KQL', representation: 'Event data' },
};

export function DataStoreLab() {
  const [profile, setProfile] = useState<WorkloadProfile>({ dataForm: 'structured', language: 'sql', latency: 'batch', workload: 'bi' });
  const results = useMemo(() => evaluateStores(profile), [profile]);
  const leader = stores[results[0].id];

  const update = <K extends keyof WorkloadProfile>(key: K, value: WorkloadProfile[K]) => setProfile((current) => ({ ...current, [key]: value }));

  return (
    <div className="lab-page">
      <header className="lab-topbar">
        <a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a>
        <div><strong>Data Store Lab</strong><span>Aurora Outfitters · Retail analytics workload</span></div>
        <span className="simulation-label">Conceptual simulation</span>
      </header>
      <main className="store-workbench">
        <section className="workload-panel" aria-labelledby="workload-heading">
          <p className="eyebrow">Workload controls</p>
          <h1 id="workload-heading">Shape the requirement</h1>
          <p>Change what Aurora needs. The stores respond by exposing relevant strengths and mismatches.</p>
          {(Object.keys(options) as (keyof WorkloadProfile)[]).map((key) => (
            <fieldset className="choice-group" key={key}>
              <legend>{key === 'dataForm' ? 'Data form' : key === 'language' ? 'Primary language' : key === 'latency' ? 'Latency' : 'Workload'}</legend>
              <div>{options[key].map(([value, label]) => <button key={value} className={profile[key] === value ? 'active' : ''} onClick={() => update(key, value)}>{label}</button>)}</div>
            </fieldset>
          ))}
          <Button variant="outline" onClick={() => setProfile({ dataForm: 'structured', language: 'sql', latency: 'batch', workload: 'bi' })}>Reset scenario</Button>
        </section>

        <section className="store-results" aria-labelledby="results-heading">
          <div className="result-heading"><div><p className="eyebrow">Architecture response</p><h2 id="results-heading">Where does this workload fit?</h2></div><div className="best-route"><Database /><span>Current strongest path</span><strong>{leader.title}</strong></div></div>
          <div className="store-cards">
            {results.map((result) => {
              const store = stores[result.id]; const Icon = store.icon;
              return <article className={`store-card fit-${result.fit.toLowerCase().replace(' ', '-')}`} key={result.id}>
                <div className="store-card-head"><span><Icon /></span><div><h3>{store.title}</h3><b>{result.fit}</b></div></div>
                <p>{store.description}</p>
                <dl><div><dt>Query engine</dt><dd>{store.engine}</dd></div><div><dt>Representation</dt><dd>{store.representation}</dd></div></dl>
                <div className="fit-meter" aria-label={`${result.score} of 4 workload characteristics aligned`}><span style={{ width: `${result.score * 25}%` }} /></div>
                <small>{result.score} of 4 characteristics align</small>
              </article>;
            })}
          </div>
          <aside className="store-explanation" aria-live="polite"><strong>Why the recommendation moved</strong><p>{results[0].id === 'warehouse' ? 'Structured tables, SQL, and BI reporting align with a Warehouse. It keeps the relational path central.' : results[0].id === 'lakehouse' ? 'Mixed data and engineering work favor a Lakehouse, where files and Delta tables can be shaped with Spark and queried with SQL.' : 'Streaming telemetry, low latency, and KQL align with Eventhouse. The architecture now prioritizes event ingestion and time-oriented analysis.'}</p></aside>
        </section>
      </main>
    </div>
  );
}
