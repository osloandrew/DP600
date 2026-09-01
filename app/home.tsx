'use client';

import { ArrowRight, Compass, Map as MapIcon, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { journeys, journeyStops } from '@/content/journeys';
import { firstStopId } from '@/engine/journeys/progress';
import { readJourneyProgress, readProgress } from '@/lib/progress';

const journey = journeys['from-question-to-report'];

const diagramNodes = [
  { id: 'sources', label: 'Sources' },
  { id: 'onelake', label: 'OneLake' },
  { id: 'stores', label: 'Lakehouse · Warehouse · Eventhouse' },
  { id: 'model', label: 'Semantic model' },
  { id: 'report', label: 'Report' },
];

const stopDiagramNode: Record<string, string> = {
  'question-orientation': 'sources', 'choose-store': 'stores', 'clean-and-shape': 'stores', 'build-star-schema': 'stores',
  'model-relationships': 'model', 'add-a-measure': 'model', 'trace-the-query': 'model', 'control-access': 'model', 'diagnose-performance': 'model',
};

export function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const progress = readJourneyProgress(journey.id);
  const started = Boolean(progress);
  const resumeStopId = progress?.currentStopId ?? firstStopId(journey.id);
  const currentStop = started ? journeyStops[resumeStopId] : undefined;
  const activeDiagramNode = currentStop ? stopDiagramNode[currentStop.id] : undefined;
  const foundationSeen = readProgress().foundationVisits.length > 0;

  return (
    <div className="app-frame home-page">
      <header className="topbar">
        <a className="brand" href="#/" aria-label="Fabric Explorer home">
          <span className="brand-mark"><Sparkles /></span>
          <span><strong>Fabric Explorer</strong><small>DP-600 systems lab</small></span>
        </a>
        <span />
        <nav className="topnav" aria-label="Primary navigation">
          <a className="active" href="#/">Home</a><a href="#/journeys"><Compass aria-hidden="true" />Field Trips</a><a href="#/foundations">Foundations</a><a href="#/map">Map</a><a href="#/exam">Exam</a><a href="#/exam/sprint">Sprint</a>
        </nav>
        <Button className="mobile-menu" variant="outline" size="icon-lg" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Menu /></Button>
      </header>
      {navOpen ? (
        <div className="nav-drawer" aria-label="Primary navigation">
          <div className="nav-drawer-head"><strong>Menu</strong><Button variant="ghost" size="icon" onClick={() => setNavOpen(false)} aria-label="Close navigation"><X /></Button></div>
          <nav aria-label="Primary navigation">
            <a className="active" href="#/" onClick={() => setNavOpen(false)}>Home</a>
            <a href="#/journeys" onClick={() => setNavOpen(false)}><Compass aria-hidden="true" />Field Trips</a>
            <a href="#/foundations" onClick={() => setNavOpen(false)}>Foundations</a>
            <a href="#/map" onClick={() => setNavOpen(false)}>Map</a>
            <a href="#/exam" onClick={() => setNavOpen(false)}>Exam</a>
            <a href="#/exam/sprint" onClick={() => setNavOpen(false)}>Sprint</a>
          </nav>
        </div>
      ) : null}
      {navOpen ? <button className="scrim" aria-label="Close navigation" onClick={() => setNavOpen(false)} /> : null}
      <main className="home-main">
        <section className="home-hero">
          <div className="home-cards">
            <article className="home-card home-card-primary">
              <p className="eyebrow"><Compass aria-hidden="true" />{started ? 'Continue the field trip' : 'Start the field trip'}</p>
              <h1>{journey.title}</h1>
              <p>{started && currentStop ? `You're on stop "${currentStop.title}." ${journey.missionSummary}` : journey.missionSummary}</p>
              <div className="home-card-actions">
                <Button size="lg" onClick={() => { window.location.hash = `#/journey/${journey.id}/${resumeStopId}`; }}>
                  {started ? 'Continue journey' : 'Start journey'}<ArrowRight />
                </Button>
                <a className="home-card-secondary-link" href="#/journeys">What will I learn?</a>
              </div>
            </article>
            <article className="home-card home-card-secondary">
              <p className="eyebrow"><MapIcon aria-hidden="true" />Explore freely</p>
              <h2>Select any object and inspect how it works</h2>
              <p>The full interactive Fabric Atlas and lab list stay available any time you want to explore off-script.</p>
              <a className="home-card-link" href="#explore">Explore freely<ArrowRight /></a>
            </article>
          </div>
          <div className="home-diagram" aria-label="Simplified Microsoft Fabric architecture">
            {diagramNodes.map((node, index) => (
              <div key={node.id} className="home-diagram-item">
                <span className={`home-diagram-node ${activeDiagramNode === node.id ? 'is-current' : ''}`}>
                  {node.label}
                  {activeDiagramNode === node.id ? <em>You are here</em> : null}
                </span>
                {index < diagramNodes.length - 1 ? <ArrowRight className="home-diagram-arrow" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </section>
        {!foundationSeen ? (
          <aside className="home-foundation-nudge">
            <p><strong>New to semantic models, star schemas, or Fabric terms?</strong> Spend 8–12 minutes on the foundation bridge first.</p>
            <a href="#/foundations">Open Foundation Bridge<ArrowRight /></a>
          </aside>
        ) : null}
      </main>
    </div>
  );
}
