'use client';

import { ArrowLeft, ArrowRight, GitMerge, Network, ShieldAlert, Table2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { evaluateRelationship, type FilterDirection, type RelationshipScenario } from '@/engine/relationships/model';

const starNodes = [
  { id: 'product', title: 'DimProduct', detail: 'Category = Bikes', side: '1' },
  { id: 'sales', title: 'FactSales', detail: 'One row per order line', side: '*' },
  { id: 'customer', title: 'DimCustomer', detail: '312 customers', side: '1' },
];

const bridgeNodes = [
  { id: 'promotion', title: 'DimPromotion', detail: 'Summer Sale', side: '1' },
  { id: 'bridge', title: 'BridgePromotionProduct', detail: 'PromotionID + ProductID', side: '*' },
  { id: 'product', title: 'DimProduct', detail: '48 matched products', side: '1' },
  { id: 'sales', title: 'FactSales', detail: 'One row per order line', side: '*' },
];

export function RelationshipLab() {
  const [scenario, setScenario] = useState<RelationshipScenario>('star');
  const [direction, setDirection] = useState<FilterDirection>('single');
  const result = useMemo(() => evaluateRelationship(scenario, direction), [scenario, direction]);
  const nodes = scenario === 'star' ? starNodes : bridgeNodes;

  return <div className="lab-page relationship-page">
    <header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Relationship Lab</strong><span>Aurora Outfitters · Filter context</span></div><span className="simulation-label">Conceptual simulation</span></header>
    <main className="relationship-workbench">
      <section className="relationship-controls" aria-labelledby="relationship-heading">
        <p className="eyebrow">Filter propagation</p><h1 id="relationship-heading">See where the filter can travel</h1>
        <p>Change the model shape and relationship direction. Highlighted tables are inside the resulting filter context.</p>
        <fieldset className="relationship-choice"><legend>Model scenario</legend><div>
          <button className={scenario === 'star' ? 'active' : ''} onClick={() => setScenario('star')}><Network />Star schema</button>
          <button className={scenario === 'bridge' ? 'active' : ''} onClick={() => setScenario('bridge')}><GitMerge />Many-to-many bridge</button>
        </div></fieldset>
        <fieldset className="relationship-choice"><legend>Cross-filter direction</legend><div>
          <button className={direction === 'single' ? 'active' : ''} onClick={() => setDirection('single')}><ArrowRight />Single</button>
          <button className={direction === 'both' ? 'active' : ''} onClick={() => setDirection('both')}><span aria-hidden="true">↔</span>Both</button>
        </div></fieldset>
        <div className="relationship-rule"><strong>{direction === 'single' ? 'Recommended default' : 'Use with intent'}</strong><p>{direction === 'single' ? 'Dimensions filter facts. Peer dimensions stay independent.' : 'Filters may travel back through a fact table and reach other dimensions.'}</p></div>
      </section>

      <section className="relationship-canvas" aria-labelledby="propagation-heading">
        <div className="relationship-heading"><div><p className="eyebrow">Live model</p><h2 id="propagation-heading">{scenario === 'star' ? 'Product category filter' : 'Promotion-to-product bridge'}</h2></div><span className="filter-chip">Active filter · {scenario === 'star' ? 'Bikes' : 'Summer Sale'}</span></div>
        <div className={`relationship-diagram scenario-${scenario} direction-${direction}`}>
          {nodes.map((node, index) => <div className="relationship-step" key={node.id}>
            <article className={`relationship-node ${result.activeNodes.includes(node.id) ? 'is-filtered' : ''} ${node.id === 'bridge' ? 'is-bridge' : ''}`}>
              <header><Table2 /><strong>{node.title}</strong><span>{node.side}</span></header><p>{node.detail}</p>
              <small>{result.activeNodes.includes(node.id) ? 'Filter context applied' : 'Not filtered'}</small>
            </article>
            {index < nodes.length - 1 ? <div className={`relationship-arrow ${result.activeNodes.includes(nodes[index + 1].id) ? 'is-active' : ''}`} aria-hidden="true"><i>{direction === 'both' ? '↔' : '→'}</i></div> : null}
          </div>)}
        </div>
        <div className="relationship-results" aria-live="polite"><div><span>Visible sales rows</span><strong>{result.visibleSales}</strong><small>of 1,240</small></div><div><span>Visible customers</span><strong>{result.visibleCustomers}</strong><small>of 312</small></div><p>{result.explanation}</p></div>
        {result.caution ? <aside className="relationship-caution"><ShieldAlert /><div><strong>{direction === 'both' ? 'Watch the return path' : 'Why the bridge matters'}</strong><p>{result.caution}</p></div></aside> : null}
      </section>
    </main>
  </div>;
}
