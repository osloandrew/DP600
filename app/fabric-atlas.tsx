'use client';

import { ArrowLeft, ArrowRight, BookOpen, Boxes, Braces, CalendarRange, ChevronRight, CircleHelp, Compass, Database, FileChartColumn, Gauge, GitBranch, GraduationCap, HardDrive, Layers3, Map as MapIcon, Menu, Network, RefreshCw, RotateCcw, Search, ServerCog, ShieldCheck, SlidersHorizontal, Sparkles, Waves, Wrench, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FoundationInline } from '@/components/foundation-inline';
import { concepts, type Concept, type ConceptId } from '@/content/concepts';
import { exam } from '@/content/exam';
import { sources } from '@/content/sources';
import { dataTrace, getTraceStep, queryTrace } from '@/engine/atlas/traces';
import { readProgress, recordConceptVisit } from '@/lib/progress';

type TraceMode = 'explore' | 'data' | 'query';

const iconById = {
  sources: Database, onelake: Layers3, lakehouse: Boxes, warehouse: ServerCog,
  eventhouse: Waves, 'semantic-model': Network, report: FileChartColumn,
} satisfies Record<ConceptId, typeof Database>;

function SystemNode({ concept, selected, active, visited, onSelect }: {
  concept: Concept; selected: boolean; active: boolean; visited: boolean; onSelect: () => void;
}) {
  const Icon = iconById[concept.id];
  return (
    <button className={`system-node node-${concept.category} ${selected ? 'is-selected' : ''} ${active ? 'is-active' : ''}`}
      onClick={onSelect} aria-pressed={selected} aria-label={`${concept.title}. ${concept.shortDescription}`}>
      <span className="node-icon" aria-hidden="true"><Icon /></span>
      <span className="node-copy"><strong>{concept.title}</strong><small>{concept.nodeLabel}</small></span>
      {visited ? <span className="visited-dot" title="Previously explored" /> : null}
    </button>
  );
}

export function FabricAtlas() {
  const [selectedId, setSelectedId] = useState<ConceptId>('onelake');
  const [mode, setMode] = useState<TraceMode>('explore');
  const [step, setStep] = useState(-1);
  const [railOpen, setRailOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [visitedIds, setVisitedIds] = useState<ConceptId[]>([]);
  const selected = concepts[selectedId];
  const trace = mode === 'query' ? queryTrace : dataTrace;
  const activeId = step >= 0 ? trace[step] : undefined;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setVisitedIds(readProgress().visitedConceptIds as ConceptId[]));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selectConcept = (id: ConceptId) => {
    setSelectedId(id);
    setInspectorOpen(true);
    setRailOpen(false);
    setVisitedIds(recordConceptVisit(id).visitedConceptIds as ConceptId[]);
  };

  const setTraceMode = (nextMode: TraceMode) => {
    setMode(nextMode);
    setStep(nextMode === 'explore' ? -1 : 0);
    if (nextMode !== 'explore') selectConcept(nextMode === 'query' ? 'report' : 'sources');
  };

  const changeStep = (next: number) => {
    const bounded = Math.max(0, Math.min(next, trace.length - 1));
    setStep(bounded);
    selectConcept(trace[bounded]);
  };

  const statusMessage = useMemo(() => {
    if (mode === 'explore') return 'Select any object to inspect its place in the system.';
    return getTraceStep(mode, step).message;
  }, [mode, step]);

  const source = sources[selected.sourceIds[0]];
  const SelectedIcon = iconById[selected.id];

  return (
    <div className="app-frame">
      <header className="topbar">
        <a className="brand" href="#explore" aria-label="Fabric Explorer home">
          <span className="brand-mark"><Sparkles /></span>
          <span><strong>Fabric Explorer</strong><small>DP-600 systems lab</small></span>
        </a>
        <button className="search-button" type="button" aria-label="Search concepts — coming in a later build">
          <Search aria-hidden="true" /><span>Search concepts</span><kbd>⌘ K</kbd>
        </button>
        <nav className="topnav" aria-label="Primary navigation">
          <a className="active" href="#explore">Explore</a><a href="#/journeys"><Compass aria-hidden="true" />Field Trips</a><a href="#/foundations">Foundations</a><a href="#/map">Map</a><a href="#/exam">Exam</a><a href="#/exam/sprint">Sprint</a>
        </nav>
        <Button className="mobile-menu" variant="outline" size="icon-lg" onClick={() => setRailOpen(true)} aria-label="Open navigation"><Menu /></Button>
      </header>

      <main className="workspace">
        <aside className={`context-rail ${railOpen ? 'is-open' : ''}`} aria-label="Explore navigation">
          <div className="rail-mobile-head"><strong>Menu</strong><Button variant="ghost" size="icon" onClick={() => setRailOpen(false)} aria-label="Close navigation"><X /></Button></div>
          <p className="eyebrow rail-mobile-only">Site</p>
          <nav className="rail-links rail-mobile-only" aria-label="Primary navigation">
            <a href="#/"><Sparkles />Home</a>
            <a href="#/journeys"><Compass />Field Trips</a>
            <a href="#/foundations"><BookOpen />Foundations</a>
            <a href="#/map"><MapIcon />Map</a>
            <a href="#/exam"><GraduationCap />Exam</a>
            <a href="#/exam/sprint"><CalendarRange />Sprint</a>
          </nav>
          <p className="eyebrow">System</p>
          <nav className="rail-links" aria-label="System views">
            <a className="active" href="#explore"><Network />Fabric Atlas</a>
            <a href="#/lab/data-stores"><Boxes />Data Store Lab</a>
            <a href="#/lab/transformation"><Wrench />Transformation</a>
            <a href="#/lab/query"><Braces />Query Rosetta</a>
            <a href="#/lab/scd"><CalendarRange />SCD Time Machine</a>
            <a href="#/lab/schema"><GitBranch />Schema Lab</a>
            <a href="#/lab/relationships"><Network />Relationship Lab</a>
            <a href="#/lab/dax"><FileChartColumn />DAX Microscope</a>
            <a href="#/lab/direct-lake"><HardDrive />Direct Lake Engine</a>
            <a href="#/lab/storage-modes"><SlidersHorizontal />Storage Modes</a>
            <a href="#/lab/incremental-refresh"><RefreshCw />Incremental Refresh</a>
            <a href="#/lab/security"><ShieldCheck />Security Lens</a>
            <a href="#/lab/performance"><Gauge />Performance Lab</a>
            <a href="#/lab/field-parameters"><SlidersHorizontal />Field Parameters</a>
            <a href="#/lab/calculation-groups"><Braces />Calculation Groups</a>
            <a href="#/lab/composite-models"><Network />Composite Models</a>
          </nav>
          <p className="eyebrow rail-section">Overlays</p>
          <div className="rail-actions">
            <button className={mode === 'data' ? 'active' : ''} onClick={() => setTraceMode('data')}><ArrowRight />Data flow</button>
            <button className={mode === 'query' ? 'active' : ''} onClick={() => setTraceMode('query')}><ArrowLeft />Query path</button>
          </div>
          <div className="exam-note"><BookOpen /><div><strong>{exam.code}</strong><span>Blueprint effective {exam.blueprintEffectiveDate}</span></div></div>
        </aside>
        {railOpen ? <button className="scrim" aria-label="Close navigation" onClick={() => setRailOpen(false)} /> : null}

        <section className="visual-space" aria-labelledby="atlas-title">
          <div className="canvas-heading">
            <div><p className="eyebrow">Fabric Atlas · Aurora Outfitters</p><h1 id="atlas-title">Explore the system</h1><p>Select an object, follow a data path, or inspect why the route changes.</p></div>
            {!inspectorOpen ? <Button variant="outline" size="lg" onClick={() => setInspectorOpen(true)}><CircleHelp />Open inspector</Button> : null}
          </div>
          <div className="mode-switcher" aria-label="Atlas overlay">
            <button className={mode === 'explore' ? 'active' : ''} onClick={() => setTraceMode('explore')}>Explore</button>
            <button className={mode === 'data' ? 'active' : ''} onClick={() => setTraceMode('data')}>Data flow</button>
            <button className={mode === 'query' ? 'active' : ''} onClick={() => setTraceMode('query')}>Query path</button>
          </div>

          <div className={`atlas-canvas mode-${mode}`}>
            <div className="canvas-grid" aria-label="Simplified Microsoft Fabric architecture">
              <div className="stage-label label-sources">Source data</div><div className="stage-label label-storage">Unified storage</div>
              <div className="node-slot slot-sources"><SystemNode concept={concepts.sources} selected={selectedId === 'sources'} active={activeId === 'sources'} visited={visitedIds.includes('sources')} onSelect={() => selectConcept('sources')} /></div>
              <div className={`flow-line line-source ${mode === 'data' && step >= 1 ? 'is-traced' : ''}`} aria-hidden="true" />
              <div className="node-slot slot-onelake"><SystemNode concept={concepts.onelake} selected={selectedId === 'onelake'} active={activeId === 'onelake'} visited={visitedIds.includes('onelake')} onSelect={() => selectConcept('onelake')} /></div>
              <div className={`branch-lines ${mode === 'data' && step >= 2 ? 'has-trace' : ''}`} aria-hidden="true">
                <span className="branch-lakehouse" /><span className="branch-warehouse" /><span className="branch-eventhouse" />
              </div>
              <div className="storage-row">
                {(['lakehouse', 'warehouse', 'eventhouse'] as ConceptId[]).map((id) => <SystemNode key={id} concept={concepts[id]} selected={selectedId === id} active={activeId === id} visited={visitedIds.includes(id)} onSelect={() => selectConcept(id)} />)}
              </div>
              <div className="analysis-bridge" aria-hidden="true">
                <div className="stage-label label-experience">Analysis</div>
                <div className={`flow-line line-model ${(mode === 'data' && step >= 3) || (mode === 'query' && step >= 2) ? 'is-traced' : ''}`} />
              </div>
              <div className="analysis-row">
                <div className="analysis-model-slot"><SystemNode concept={concepts['semantic-model']} selected={selectedId === 'semantic-model'} active={activeId === 'semantic-model'} visited={visitedIds.includes('semantic-model')} onSelect={() => selectConcept('semantic-model')} /></div>
                <div className={`horizontal-link ${mode === 'data' && step >= 4 || mode === 'query' && step >= 1 ? 'is-traced' : ''}`} aria-hidden="true"><span /></div>
                <div className="analysis-report-slot"><SystemNode concept={concepts.report} selected={selectedId === 'report'} active={activeId === 'report'} visited={visitedIds.includes('report')} onSelect={() => selectConcept('report')} /></div>
              </div>
            </div>
            <div className="canvas-legend" aria-label="Diagram legend">
              <span><i className="legend-storage" />Storage</span><span><i className="legend-model" />Semantic model</span><span><i className="legend-report" />Report</span><span><b>→</b>{mode === 'query' ? 'Query direction' : 'Data direction'}</span>
            </div>
          </div>

          <section className="trace-console" aria-label="Trace controls">
            <div className="trace-status"><span className={`status-icon ${mode}`} aria-hidden="true">{mode === 'query' ? <ArrowLeft /> : <ArrowRight />}</span><div><strong>{mode === 'explore' ? 'Free exploration' : mode === 'data' ? 'Tracing order #10482' : 'Tracing a report query'}</strong><p>{statusMessage}</p></div></div>
            {mode === 'explore' ? <Button onClick={() => setTraceMode('data')} size="lg">Trace sales data <ArrowRight /></Button> : (
              <div className="step-controls"><Button variant="outline" size="icon-lg" onClick={() => changeStep(step - 1)} disabled={step <= 0} aria-label="Previous step"><ArrowLeft /></Button><span>Step {step + 1} of {trace.length}</span><Button size="icon-lg" onClick={() => changeStep(step + 1)} disabled={step >= trace.length - 1} aria-label="Next step"><ArrowRight /></Button><Button variant="ghost" size="icon-lg" onClick={() => setTraceMode(mode)} aria-label="Reset trace"><RotateCcw /></Button></div>
            )}
          </section>
        </section>

        <aside className={`inspector ${inspectorOpen ? 'is-open' : ''}`} aria-label="Concept inspector" aria-live="polite">
          <div className="inspector-head"><div className={`inspector-icon node-${selected.category}`}><SelectedIcon /></div><Button variant="ghost" size="icon" onClick={() => setInspectorOpen(false)} aria-label="Close inspector"><X /></Button></div>
          <p className="eyebrow">{selected.categoryLabel}</p><h2>{selected.title}</h2><p className="inspector-summary">{selected.shortDescription}</p>
          <FoundationInline ids={selected.prerequisiteFoundationIds ?? []} />
          <div className="inspector-section"><h3>What is happening?</h3><p>{selected.currentState}</p></div>
          <div className="inspector-section why-section"><h3>Why?</h3><p>{selected.why}</p></div>
          <div className="inspector-section"><h3>Try</h3><button className="try-action" onClick={() => setTraceMode(selected.id === 'report' ? 'query' : 'data')}>{selected.tryAction}<ChevronRight /></button></div>
          <div className="inspector-section"><h3>Exam connection</h3><div className="objective-list">{selected.objectiveIds.map((objective) => <span key={objective}>{objective}</span>)}</div></div>
          <div className="source-block"><span>Based on</span><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowRight /></a><small>Verified {source.accessed}</small></div>
        </aside>
      </main>
    </div>
  );
}
