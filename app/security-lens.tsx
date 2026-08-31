'use client';

import { ArrowDown, ArrowLeft, BookOpen, Database, Eye, EyeOff, FileChartColumn, FolderLock, Layers3, LockKeyhole, ShieldCheck, Table2, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { evaluateSecurity, securityAccuracyNote, securityIdentityLabels, securityLayerCopy, type SecurityIdentity, type SecurityLayer } from '@/engine/security/lens';

const identities = Object.entries(securityIdentityLabels) as [SecurityIdentity, string][];
const layers: { id: SecurityLayer; icon: typeof LockKeyhole }[] = [
  { id: 'workspace', icon: Layers3 }, { id: 'item', icon: FileChartColumn }, { id: 'semantic-model', icon: Database },
  { id: 'object', icon: Table2 }, { id: 'column', icon: EyeOff }, { id: 'row', icon: ShieldCheck }, { id: 'onelake', icon: FolderLock },
];

export function SecurityLens() {
  const [identity, setIdentity] = useState<SecurityIdentity>('norway-sales');
  const [selectedLayer, setSelectedLayer] = useState<SecurityLayer>('row');
  const state = useMemo(() => evaluateSecurity(identity), [identity]);
  const selected = securityLayerCopy[selectedLayer];

  return <div className="lab-page security-page"><header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Security Lens</strong><span>Aurora Outfitters · Sales system</span></div><span className="simulation-label">Effective-access model</span></header><main className="security-shell">
    <section className="security-controls" aria-labelledby="security-title"><p className="eyebrow">Identity lens</p><h1 id="security-title">See where access changes</h1><p>Switch identities, then select a layer. The same person can reach a report while remaining blocked from its underlying OneLake data.</p><fieldset><legend>View as</legend>{identities.map(([id, label]) => <button key={id} className={identity === id ? 'active' : ''} onClick={() => setIdentity(id)}><UserRound /><span><strong>{label}</strong><small>{id === 'workspace-admin' ? 'Admin' : id === 'data-analyst' ? 'Contributor' : id === 'external-consumer' ? 'Shared item only' : 'Viewer'}</small></span></button>)}</fieldset><aside><ShieldCheck /><div><strong>{state.modelSecurityBypassed ? 'Edit permission changes the result' : 'Consumer security is enforced'}</strong><p>{state.explanation}</p></div></aside></section>
    <section className="security-stage" aria-labelledby="security-stack-title"><div className="security-heading"><div><p className="eyebrow">Effective access path</p><h2 id="security-stack-title">{securityIdentityLabels[identity]}</h2></div><span>{state.workspace}</span></div>
      <div className="security-workspace"><section className="security-stack" aria-label="Security layers">{layers.map(({ id, icon: Icon }, index) => { const copy = securityLayerCopy[id]; const enforced = state.activeLayers.includes(id); return <div className="security-layer-step" key={id}><button className={`${selectedLayer === id ? 'is-selected' : ''} ${enforced ? 'is-enforced' : 'is-bypassed'}`} onClick={() => setSelectedLayer(id)} aria-pressed={selectedLayer === id}><span><Icon /></span><div><small>{copy.mechanism}</small><strong>{copy.title}</strong></div><b>{id === 'workspace' ? state.workspace : id === 'item' ? state.item : id === 'semantic-model' ? state.modelSecurityBypassed ? 'Bypassed' : 'Role applied' : id === 'object' ? state.hiddenObjects.length ? `${state.hiddenObjects.length} hidden` : 'Visible' : id === 'column' ? state.hiddenColumns.length ? `${state.hiddenColumns.length} hidden` : 'Visible' : id === 'row' ? state.region : state.oneLake}</b></button>{index < layers.length - 1 ? <ArrowDown /> : null}</div>; })}</section>
        <section className="security-report" aria-label="Resulting report"><header><FileChartColumn /><div><small>Sales performance report</small><strong>{state.reportRows.length} visible order lines · ${state.totalRevenue.toLocaleString()}</strong></div><span><Eye />Report allowed</span></header><div className="security-table-wrap"><table><thead><tr>{state.visibleColumns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{state.reportRows.map((row) => <tr key={row.orderId}>{state.visibleColumns.map((column) => <td key={column}>{column === 'OrderID' ? row.orderId : column === 'Region' ? row.region : column === 'Product' ? row.product : column === 'Revenue' ? `$${row.revenue}` : column === 'Margin' ? `$${row.margin}` : `$${row.unitCost}`}</td>)}</tr>)}</tbody></table></div><footer><span><EyeOff />Hidden model objects</span><strong>{[...state.hiddenObjects, ...state.hiddenColumns].join(', ') || 'None'}</strong></footer></section>
      </div>
      <section className="security-inspection"><div><LockKeyhole /><span><small>{selected.mechanism}</small><strong>{selected.title}</strong></span></div><p>{selected.explanation}</p><b>{state.activeLayers.includes(selectedLayer) ? 'Evaluated for this identity' : 'Bypassed by edit-capable workspace role'}</b></section>
      <section className={`onelake-result ${state.oneLakeBlocked ? 'is-blocked' : ''}`}><div><FolderLock /><span><small>Direct OneLake table access</small><strong>{state.oneLakeBlocked ? 'Blocked' : `${state.directRows.length} FactSales rows available`}</strong></span></div><p>{state.oneLakeBlocked ? 'Report Read permission does not grant direct access to the underlying Delta table.' : `${state.oneLake} provides ${state.directRegion === 'All' ? 'full table access' : `${state.directRegion}-scoped access`} independently of the report result.`}</p></section>
      <footer className="security-source"><span>{securityAccuracyNote}</span><a href="https://learn.microsoft.com/en-us/fabric/security/permission-model" target="_blank" rel="noreferrer"><BookOpen />Microsoft Fabric permission model</a></footer>
    </section>
  </main></div>;
}
