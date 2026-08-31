'use client';

import { ArrowLeft, ArrowRight, Compass, Eye, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { FoundationInline } from '@/components/foundation-inline';
import type { Journey, JourneyStop } from '@/content/journeys';
import { nextStopId, previousStopId } from '@/engine/journeys/progress';
import { recordJourneyStop } from '@/lib/progress';

export function JourneyStopChrome({ journey, stop, children }: { journey: Journey; stop: JourneyStop; children: ReactNode }) {
  const [showDebrief, setShowDebrief] = useState(false);
  const index = journey.stopIds.indexOf(stop.id);
  const next = nextStopId(journey.id, stop.id);
  const previous = previousStopId(journey.id, stop.id);
  const isLast = !next;

  useEffect(() => {
    recordJourneyStop(journey.id, stop.id, false);
  }, [journey.id, stop.id]);

  const goToStop = (stopId: string) => { window.location.hash = `#/journey/${journey.id}/${stopId}`; };
  const finishStop = () => {
    recordJourneyStop(journey.id, stop.id, true);
    if (next) goToStop(next); else window.location.hash = '#/journeys';
  };

  return (
    <div className="journey-chrome">
      <header className="journey-banner">
        <div className="journey-banner-top">
          <a className="journey-exit" href="#/journeys"><ArrowLeft />Exit field trip</a>
          <span className="journey-progress"><Compass />Stop {index + 1} of {journey.stopIds.length}</span>
        </div>
        <p className="eyebrow">{journey.title}</p>
        <div className="journey-mission">
          <h1>{stop.title}</h1>
          {stop.roleContext ? <span className="journey-role">{stop.roleContext}</span> : null}
          <p>{stop.mission}</p>
        </div>
        <div className="journey-watch">
          <p className="eyebrow"><Eye aria-hidden="true" />What to watch</p>
          <ul>{stop.watchFor.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <FoundationInline ids={stop.prerequisiteFoundationIds} />
        <a className="journey-freely" href={stop.labHref}><MapPin />Explore this freely instead</a>
      </header>

      <div className="journey-embedded-lab">{children}</div>

      <footer className="journey-debrief-bar">
        {!showDebrief ? (
          <Button size="lg" onClick={() => setShowDebrief(true)}>Ready to continue<ArrowRight /></Button>
        ) : (
          <div className="journey-debrief">
            <div className="journey-debrief-section"><h2>General rule</h2><p>{stop.generalRule}</p></div>
            <div className="journey-debrief-section journey-exam-lens">
              <h2>Exam lens</h2>
              <div className="objective-list">{stop.examLens.objectiveIds.map((id) => <span key={id}>{id}</span>)}</div>
              <p>{stop.examLens.scenario}</p>
              <p className="journey-exam-wording">{stop.examLens.wording}</p>
            </div>
            <div className="journey-debrief-nav">
              <Button variant="outline" size="lg" disabled={!previous} onClick={() => previous && goToStop(previous)}><ArrowLeft />Previous stop</Button>
              <Button size="lg" onClick={finishStop}>{isLast ? 'Finish field trip' : 'Next stop'}<ArrowRight /></Button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
