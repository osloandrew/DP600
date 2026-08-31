'use client';

import { ArrowLeft, ArrowRight, Compass, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { journeys, journeyStops } from '@/content/journeys';
import { firstStopId } from '@/engine/journeys/progress';
import { readJourneyProgress } from '@/lib/progress';

export function JourneyIndex() {
  return (
    <div className="lab-page journey-index-page">
      <header className="lab-topbar">
        <a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a>
        <div><strong>Field Trips</strong><span>Guided Aurora Outfitters journeys</span></div>
        <span className="simulation-label">Guided learning</span>
      </header>
      <main className="journey-index">
        {Object.values(journeys).map((journey) => {
          const progress = readJourneyProgress(journey.id);
          const total = journey.stopIds.length;
          const completed = progress?.completedStopIds.length ?? 0;
          const resumeStopId = progress?.currentStopId ?? firstStopId(journey.id);
          const started = Boolean(progress);
          return (
            <article key={journey.id} className="journey-card">
              <p className="eyebrow"><Compass aria-hidden="true" />Guided field trip</p>
              <h1>{journey.title}</h1>
              <p>{journey.missionSummary}</p>
              <ol className="journey-stop-list">
                {journey.stopIds.map((stopId, index) => {
                  const stop = journeyStops[stopId];
                  const isDone = progress?.completedStopIds.includes(stopId);
                  return <li key={stopId} className={isDone ? 'is-done' : ''}><span>{index + 1}</span>{stop.title}</li>;
                })}
              </ol>
              <div className="journey-card-actions">
                <Button size="lg" onClick={() => { window.location.hash = `#/journey/${journey.id}/${resumeStopId}`; }}>
                  {started ? 'Continue field trip' : 'Start field trip'}<ArrowRight />
                </Button>
                {started ? (
                  <Button variant="ghost" onClick={() => { window.location.hash = `#/journey/${journey.id}/${firstStopId(journey.id)}`; }}>
                    <RotateCcw />Start over
                  </Button>
                ) : null}
              </div>
              <p className="journey-progress-note">{completed} of {total} stops completed</p>
            </article>
          );
        })}
      </main>
    </div>
  );
}
