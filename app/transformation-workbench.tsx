'use client';

import { ArrowLeft, CalendarDays, ChevronRight, CircleDotDashed, Code2, CopyX, Filter, GitMerge, RotateCcw, Sigma, Undo2, Wrench } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { evaluatePipeline, getQualitySummary, transformationAccuracyNote, transformationDefinitions, type TransformId } from '@/engine/transformation/pipeline';

const operationIds: TransformId[] = ['change-date-type', 'replace-null-quantity', 'remove-duplicates', 'join-region', 'add-revenue', 'filter-incomplete'];
const operationIcons = { 'change-date-type': CalendarDays, 'replace-null-quantity': CircleDotDashed, 'remove-duplicates': CopyX, 'join-region': GitMerge, 'add-revenue': Sigma, 'filter-incomplete': Filter };

export function TransformationWorkbench() {
  const [pipeline, setPipeline] = useState<TransformId[]>([]);
  const [selectedTool, setSelectedTool] = useState<TransformId>('change-date-type');
  const [previewStep, setPreviewStep] = useState(0);
  const [showEquivalent, setShowEquivalent] = useState(false);
  const snapshot = useMemo(() => evaluatePipeline(pipeline, previewStep), [pipeline, previewStep]);
  const quality = useMemo(() => getQualitySummary(snapshot.rows), [snapshot.rows]);
  const definition = transformationDefinitions[selectedTool];

  const addStep = () => {
    if (pipeline.includes(selectedTool)) return;
    const next = [...pipeline, selectedTool];
    setPipeline(next); setPreviewStep(next.length); setShowEquivalent(false);
  };
  const undo = () => { const next = pipeline.slice(0, -1); setPipeline(next); setPreviewStep(next.length); };
  const reset = () => { setPipeline([]); setPreviewStep(0); setSelectedTool('change-date-type'); setShowEquivalent(false); };
  const activeChangedCells = new Set(snapshot.changedCells);

  return <div className="lab-page transformation-page">
    <header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Transformation Workbench</strong><span>Aurora Outfitters · Raw orders</span></div><span className="simulation-label">Conceptual sandbox</span></header>
    <main className="transformation-shell">
      <section className="transformation-tools" aria-labelledby="transformation-heading">
        <p className="eyebrow">Tool palette</p><h1 id="transformation-heading">Shape a trustworthy sales table</h1><p>Add operations in any order. The preview preserves step order, so repairing a value before or after deriving Revenue can produce a different result.</p>
        <nav className="tool-list" aria-label="Available transformations">{operationIds.map((id) => { const item = transformationDefinitions[id]; const Icon = operationIcons[id]; const applied = pipeline.includes(id); return <button key={id} className={`${selectedTool === id ? 'active' : ''} ${applied ? 'is-applied' : ''}`} onClick={() => { setSelectedTool(id); setShowEquivalent(false); }} aria-pressed={selectedTool === id}><Icon /><span><strong>{item.label}</strong><small>{applied ? 'Already in pipeline' : item.description}</small></span><ChevronRight /></button>; })}</nav>
        <div className="tool-detail"><strong>{definition.label}</strong><p>{definition.description}</p><Button onClick={addStep} disabled={pipeline.includes(selectedTool)}><Wrench />{pipeline.includes(selectedTool) ? 'Step already applied' : 'Add transformation step'}</Button><Button variant="ghost" onClick={() => setShowEquivalent((value) => !value)}><Code2 />{showEquivalent ? 'Hide equivalents' : 'Show equivalents'}</Button>{showEquivalent ? <div className="equivalent-code"><span>Power Query concept</span><code>{definition.powerQuery}</code><span>SQL concept</span><code>{definition.sql}</code></div> : null}</div>
      </section>

      <section className="transformation-stage" aria-labelledby="preview-heading">
        <div className="transformation-heading"><div><p className="eyebrow">Live table preview</p><h2 id="preview-heading">{previewStep === 0 ? 'RawOrders' : transformationDefinitions[pipeline[previewStep - 1]].shortLabel}</h2></div><div className="quality-summary"><span><b>{quality.rowCount}</b> rows</span><span className={quality.duplicates ? 'has-issue' : ''}><b>{quality.duplicates}</b> duplicate</span><span className={quality.missingCells ? 'has-issue' : ''}><b>{quality.missingCells}</b> missing cells</span></div></div>
        <div className="pipeline-bar" aria-label="Applied transformation steps"><button className={previewStep === 0 ? 'active' : ''} onClick={() => setPreviewStep(0)}><span>0</span><strong>Source</strong><small>{evaluatePipeline([]).rows.length} rows</small></button>{pipeline.map((id, index) => { const stepSnapshot = evaluatePipeline(pipeline, index + 1); return <button className={previewStep === index + 1 ? 'active' : ''} onClick={() => { setPreviewStep(index + 1); setSelectedTool(id); }} key={id}><span>{index + 1}</span><strong>{transformationDefinitions[id].shortLabel}</strong><small>{stepSnapshot.rows.length} rows</small></button>; })}</div>
        <div className="transformation-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Store</th><th>Region</th><th>Qty</th><th>Price</th><th>Order date <small>{snapshot.metadata.dateType}</small></th>{snapshot.metadata.revenueAdded ? <th>Revenue</th> : null}</tr></thead><tbody>{snapshot.rows.map((row) => <tr key={row.sourceRow}><td>#{row.orderId}</td><td>{row.customer}</td><td>{row.storeId}</td><td className={`${row.region === null ? 'cell-missing' : ''} ${activeChangedCells.has(`${row.sourceRow}:region`) ? 'cell-changed' : ''}`}>{row.region ?? 'NULL'}</td><td className={`${row.quantity === null ? 'cell-missing' : ''} ${activeChangedCells.has(`${row.sourceRow}:quantity`) ? 'cell-changed' : ''}`}>{row.quantity ?? 'NULL'}</td><td>${row.unitPrice}</td><td className={`${row.orderDate === null ? 'cell-missing' : ''} ${activeChangedCells.has(`${row.sourceRow}:orderDate`) ? 'cell-changed' : ''}`}>{row.orderDate ?? 'NULL'}</td>{snapshot.metadata.revenueAdded ? <td className={`${row.revenue === null ? 'cell-missing' : ''} ${activeChangedCells.has(`${row.sourceRow}:revenue`) ? 'cell-changed' : ''}`}>{row.revenue === null ? 'NULL' : `$${row.revenue?.toLocaleString()}`}</td> : null}</tr>)}</tbody></table></div>
        <div className="transformation-footer"><aside aria-live="polite"><strong>{previewStep === 0 ? 'Source state' : `Previewing step ${previewStep} of ${pipeline.length}`}</strong><p>{previewStep === 0 ? 'Duplicate rows, missing values, and mixed date formats are visible. Choose a tool to decide what changes first.' : snapshot.removedRows > 0 ? `This step removed ${snapshot.removedRows} row${snapshot.removedRows === 1 ? '' : 's'}. Select another pipeline step to compare its table state.` : snapshot.changedCells.length > 0 ? `${snapshot.changedCells.length} cells changed in this step. Highlighted cells show the immediate consequence.` : 'This step changed table metadata or left the visible rows unchanged.'}</p><small>{transformationAccuracyNote}</small></aside><div><Button variant="outline" onClick={undo} disabled={pipeline.length === 0}><Undo2 />Undo last</Button><Button variant="ghost" onClick={reset} disabled={pipeline.length === 0}><RotateCcw />Reset</Button></div></div>
      </section>
    </main>
  </div>;
}
