'use client';

import { ArrowLeft, ArrowRight, Calculator, ChevronLeft, ChevronRight, Filter, RotateCcw, Sigma, Table2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { daxScenarios, evaluateDax, salesRows, type DaxScenarioId } from '@/engine/dax/microscope';

const scenarioIds: DaxScenarioId[] = ['sum', 'calculate', 'sumx', 'all'];

export function DaxMicroscope() {
  const [scenarioId, setScenarioId] = useState<DaxScenarioId>('sum');
  const [step, setStep] = useState(0);
  const scenario = daxScenarios[scenarioId];
  const state = useMemo(() => evaluateDax(scenarioId, step), [scenarioId, step]);
  const chooseScenario = (id: DaxScenarioId) => { setScenarioId(id); setStep(0); };

  return <div className="lab-page dax-page">
    <header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>DAX Microscope</strong><span>Aurora Outfitters · Sales measures</span></div><span className="simulation-label">Deterministic execution</span></header>
    <main className="dax-workbench">
      <section className="dax-sidebar" aria-labelledby="dax-heading">
        <p className="eyebrow">Curated scenarios</p><h1 id="dax-heading">Watch context become a number</h1><p>Step through one expression at a time. Rows show exactly what DAX can currently see.</p>
        <nav className="dax-scenarios" aria-label="DAX scenarios">{scenarioIds.map((id) => <button className={scenarioId === id ? 'active' : ''} onClick={() => chooseScenario(id)} key={id}><span><Sigma /></span><strong>{daxScenarios[id].label}</strong><small>{id === 'sum' ? 'Column aggregation' : id === 'calculate' ? 'Modify filter context' : id === 'sumx' ? 'Row-by-row iterator' : 'Remove a filter'}</small><ChevronRight /></button>)}</nav>
        <div className="dax-model"><p className="eyebrow">Tiny model</p><div><span>DimProduct</span><i><ArrowRight /></i><span>FactSales</span></div><small>Category filters propagate from the one side to the many side.</small></div>
      </section>
      <section className="dax-stage" aria-labelledby="expression-heading">
        <div className="dax-expression"><div><p className="eyebrow">Expression</p><h2 id="expression-heading">{scenario.label}</h2></div><code>{scenario.expression}</code></div>
        <div className="dax-stepbar"><div><span>Step {state.step + 1} of {scenario.steps.length}</span><strong>{state.label}</strong></div><div><Button variant="outline" size="icon" aria-label="Previous DAX step" disabled={state.step === 0} onClick={() => setStep((value) => value - 1)}><ChevronLeft /></Button><Button size="icon" aria-label="Next DAX step" disabled={state.step === scenario.steps.length - 1} onClick={() => setStep((value) => value + 1)}><ChevronRight /></Button><Button variant="ghost" size="icon" aria-label="Reset DAX scenario" onClick={() => setStep(0)}><RotateCcw /></Button></div></div>
        <div className="dax-context"><div className="context-title"><Filter /><strong>Filter context</strong>{state.filterChips.length ? state.filterChips.map((chip) => <span key={chip}>{chip}</span>) : <span className="empty-filter">No filters</span>}</div>{scenarioId === 'all' && state.step >= 1 ? <small className="removed-filter">Category = Bikes removed by ALL</small> : null}</div>
        <div className="dax-evaluation">
          <section className="dax-table-wrap" aria-labelledby="fact-table-heading"><div className="dax-table-title"><Table2 /><strong id="fact-table-heading">FactSales</strong><span>{state.visibleRowIds.length} of {salesRows.length} rows visible</span></div><div className="dax-table-scroll"><table><thead><tr><th>Order</th><th>Category</th><th>Qty</th><th>Unit price</th><th>Revenue</th><th>Status</th></tr></thead><tbody>{salesRows.map((row) => { const visible = state.visibleRowIds.includes(row.id); const current = state.currentRowId === row.id; return <tr key={row.id} className={`${visible ? 'is-visible' : 'is-filtered'} ${current ? 'is-current' : ''}`}><td>#{row.id}</td><td>{row.category}</td><td>{row.quantity}</td><td>${row.unitPrice.toLocaleString()}</td><td>${row.revenue.toLocaleString()}</td><td><span>{current ? 'Current row' : visible ? 'Included' : 'Filtered out'}</span></td></tr>; })}</tbody></table></div></section>
          <aside className="dax-state" aria-live="polite"><div className="state-icon"><Calculator /></div><p className="eyebrow">Evaluation state</p>{scenarioId === 'sumx' ? <dl><div><dt>Row expression</dt><dd>{state.currentValue === undefined ? 'Waiting' : `$${state.currentValue.toLocaleString()}`}</dd></div><div><dt>Accumulator</dt><dd>${state.accumulator.toLocaleString()}</dd></div></dl> : <dl><div><dt>Visible revenue</dt><dd>${state.accumulator.toLocaleString()}</dd></div><div><dt>Rows contributing</dt><dd>{state.visibleRowIds.length}</dd></div></dl>}<div className={`dax-result ${state.resultReady ? 'ready' : ''}`}><span>{state.resultReady ? 'Final result' : 'Intermediate result'}</span><strong>${state.accumulator.toLocaleString()}</strong></div></aside>
        </div>
      </section>
    </main>
  </div>;
}
