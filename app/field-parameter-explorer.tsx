'use client';

import { ArrowLeft, BarChart3, BookOpen, Boxes, ChevronRight, Database, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { evaluateFieldParameters, fieldParameterAccuracyNote, formatParameterValue, type AxisField, type MeasureField } from '@/engine/field-parameters/model';

const axes: { id: AxisField; label: string }[] = [{ id: 'category', label: 'Category' }, { id: 'brand', label: 'Brand' }, { id: 'region', label: 'Region' }, { id: 'store', label: 'Store' }];
const measures: { id: MeasureField; label: string }[] = [{ id: 'revenue', label: 'Revenue' }, { id: 'margin', label: 'Margin' }, { id: 'orders', label: 'Orders' }];

export function FieldParameterExplorer() {
  const [axis, setAxis] = useState<AxisField>('category');
  const [measure, setMeasure] = useState<MeasureField>('revenue');
  const result = useMemo(() => evaluateFieldParameters(axis, measure), [axis, measure]);

  return <div className="lab-page field-parameter-page"><header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Field Parameter Explorer</strong><span>Aurora Outfitters · Dynamic report</span></div><span className="simulation-label">Report interaction model</span></header><main className="parameter-shell">
    <section className="parameter-controls" aria-labelledby="parameter-title"><p className="eyebrow">Report reader controls</p><h1 id="parameter-title">Change what the visual analyzes</h1><p>Use one parameter for the chart axis and another for its value. Watch the field wells change while the visual itself stays put.</p><fieldset><legend>Group by</legend><div>{axes.map((item) => <button className={axis === item.id ? 'active' : ''} key={item.id} onClick={() => setAxis(item.id)}>{item.label}</button>)}</div></fieldset><fieldset><legend>Measure</legend><div>{measures.map((item) => <button className={measure === item.id ? 'active' : ''} key={item.id} onClick={() => setMeasure(item.id)}>{item.label}</button>)}</div></fieldset><aside><SlidersHorizontal /><div><strong>Parameter, not filter</strong><p>The slicer chooses which field reference occupies a visual property. It does not select values inside Category, Brand, Region, or Store.</p></div></aside></section>
    <section className="parameter-stage" aria-labelledby="dynamic-chart-title"><div className="parameter-heading"><div><p className="eyebrow">Report canvas</p><h2 id="dynamic-chart-title">{result.title}</h2></div><span>Same visual · new fields</span></div>
      <div className="report-canvas"><section className="parameter-chart"><header><BarChart3 /><div><small>Clustered bar chart</small><strong>{result.title}</strong></div></header><div className="dynamic-bars">{result.points.map((point) => <div key={point.label}><b>{point.label}</b><span><i style={{ width: `${point.relativeWidth}%` }} /><strong>{formatParameterValue(point.value, measure)}</strong></span></div>)}</div></section><aside className="field-wells"><p className="eyebrow">Build visual</p><section><small>Y-axis</small><div><Boxes /><span><strong>Axis Parameter</strong><b>{result.axis.field}</b></span></div></section><ChevronRight /><section><small>X-axis</small><div><Database /><span><strong>Measure Parameter</strong><b>{result.measure.field}</b></span></div></section></aside></div>
      <section className="parameter-inspector"><SlidersHorizontal /><div><small>Resolved parameter state</small><strong>{result.axis.label} + {result.measure.label}</strong><p>{result.explanation}</p></div></section>
      <section className="parameter-definition"><div><small>Axis Parameter</small><code>{`("${axes.find((item) => item.id === axis)!.label}", NAMEOF(${result.axis.field}), ${axes.findIndex((item) => item.id === axis)})`}</code></div><div><small>Measure Parameter</small><code>{`("${result.measure.label}", NAMEOF(${result.measure.field}), ${measures.findIndex((item) => item.id === measure)})`}</code></div></section>
      <footer className="security-source"><span>{fieldParameterAccuracyNote}</span><a href="https://learn.microsoft.com/en-us/power-bi/create-reports/power-bi-field-parameters" target="_blank" rel="noreferrer"><BookOpen />Microsoft field parameter guidance</a></footer>
    </section>
  </main></div>;
}
