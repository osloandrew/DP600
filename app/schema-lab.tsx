'use client';

import { ArrowLeft, ArrowRight, GitBranch, KeyRound, RotateCcw, Table2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { activeRelationships, buildSuggestedSchema, fieldTarget, initialSchema, moveField, relationshipKeys, type FieldId, type SchemaState, type TableId } from '@/engine/schema/model';

const tableNames: Record<TableId, string> = { source: 'OperationalSales', fact: 'FactSales', customer: 'DimCustomer', product: 'DimProduct', store: 'DimStore', date: 'DimDate' };
const dimensionIds: TableId[] = ['customer', 'product', 'store', 'date'];

function Field({ id, selected, keyField, onClick }: { id: FieldId; selected: boolean; keyField?: boolean; onClick?: () => void }) {
  return <button className={`schema-field ${selected ? 'selected' : ''}`} onClick={onClick} disabled={!onClick} aria-pressed={onClick ? selected : undefined}>
    {keyField ? <KeyRound aria-label="Key" /> : null}<span>{id}</span>
  </button>;
}

export function SchemaLab() {
  const [schema, setSchema] = useState<SchemaState>(initialSchema);
  const [selected, setSelected] = useState<FieldId | null>('ProductID');
  const relationships = useMemo(() => activeRelationships(schema), [schema]);
  const movedCount = initialSchema.source.length - schema.source.length;

  const moveSelected = () => {
    if (!selected) return;
    setSchema((current) => moveField(current, selected));
    const remaining = schema.source.filter((field) => field !== selected);
    setSelected(remaining[0] ?? null);
  };

  return <div className="lab-page schema-page">
    <header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Schema Lab</strong><span>Aurora Outfitters · Sales model</span></div><span className="simulation-label">Conceptual simulation</span></header>
    <main className="schema-workbench">
      <section className="source-schema" aria-labelledby="source-schema-heading">
        <p className="eyebrow">Operational source</p><h1 id="source-schema-heading">Find the model inside the table</h1>
        <p>Repeated descriptive values are mixed with order-line measurements. Select a field, then move it to its natural analytical table.</p>
        <div className="source-table-head"><Table2 /><strong>OperationalSales</strong><span>{schema.source.length} fields remain</span></div>
        <div className="source-fields">{schema.source.map((field) => <Field key={field} id={field} selected={selected === field} onClick={() => setSelected(field)} />)}</div>
        {schema.source.length === 0 ? <div className="schema-empty">All source fields have been modeled. Reset to explore another sequence.</div> : null}
        <div className="schema-action">
          <div><span>Selected field</span><strong>{selected ?? 'None'}</strong>{selected ? <small>Suggested destination: {tableNames[fieldTarget[selected]]}</small> : null}</div>
          <Button onClick={moveSelected} disabled={!selected}>Move field <ArrowRight /></Button>
        </div>
        <div className="schema-secondary-actions"><Button variant="outline" onClick={() => { setSchema(buildSuggestedSchema()); setSelected(null); }}>Build suggested star</Button><Button variant="ghost" onClick={() => { setSchema(initialSchema); setSelected('ProductID'); }}><RotateCcw />Reset</Button></div>
      </section>

      <section className="model-canvas" aria-labelledby="model-heading">
        <div className="model-heading"><div><p className="eyebrow">Analytical model</p><h2 id="model-heading">Star schema</h2></div><div className="grain-badge"><span>Current FactSales grain</span><strong>{schema.fact.includes('OrderLineID') ? 'One row per order line' : 'Not established yet'}</strong></div></div>
        <div className="star-layout">
          <article className="model-table fact-table"><header><Table2 /><strong>FactSales</strong><span>{schema.fact.length}</span></header><div>{schema.fact.map((field) => <Field key={field} id={field} selected={false} keyField={Object.values(relationshipKeys).includes(field)} />)}{schema.fact.length === 0 ? <p>Move measurements and keys here.</p> : null}</div></article>
          <div className="relationship-spokes" aria-hidden="true">{dimensionIds.map((id) => <span key={id} className={relationships.some(([table]) => table === id) ? 'active' : ''}><i>1</i><b>→</b><i>*</i></span>)}</div>
          <div className="dimension-grid">{dimensionIds.map((id) => <article className={`model-table dimension-table ${relationships.some(([table]) => table === id) ? 'related' : ''}`} key={id}><header><GitBranch /><strong>{tableNames[id]}</strong><span>{schema[id].length}</span></header><div>{schema[id].map((field) => <Field key={field} id={field} selected={false} keyField={relationshipKeys[id as keyof typeof relationshipKeys] === field} />)}{schema[id].length === 0 ? <p>No fields yet</p> : null}</div></article>)}</div>
        </div>
        <aside className="schema-observation" aria-live="polite"><strong>{movedCount === 0 ? 'Start with a repeated attribute' : `${movedCount} of ${initialSchema.source.length} fields modeled`}</strong><p>{relationships.length === 0 ? 'Move ProductID, CustomerID, StoreID, or OrderDate to reveal a one-to-many relationship while retaining its foreign key in FactSales.' : `${relationships.length} relationship${relationships.length === 1 ? '' : 's'} now connect dimensions used for filtering to FactSales used for summarization.`}</p></aside>
      </section>
    </main>
  </div>;
}
