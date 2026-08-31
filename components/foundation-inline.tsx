'use client';

import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { foundations, type FoundationConceptId } from '@/content/foundations';
import { recordFoundationVisit } from '@/lib/progress';

export function FoundationInline({ ids }: { ids: FoundationConceptId[] }) {
  const [openId, setOpenId] = useState<FoundationConceptId | null>(null);
  const [revealedId, setRevealedId] = useState<FoundationConceptId | null>(null);

  if (ids.length === 0) return null;

  const open = openId ? foundations[openId] : undefined;

  return (
    <div className="foundation-inline">
      <p className="eyebrow">Before this makes sense</p>
      <div className="foundation-chip-row">
        {ids.map((id) => {
          const foundation = foundations[id];
          const isOpen = openId === id;
          return (
            <button key={id} type="button" className={`foundation-chip ${isOpen ? 'is-open' : ''}`} aria-expanded={isOpen}
              onClick={() => {
                const next = isOpen ? null : id;
                setOpenId(next);
                if (next) recordFoundationVisit(next);
              }}>
              {foundation.title}{isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          );
        })}
      </div>
      {open ? (
        <section className="foundation-panel" aria-label={open.title}>
          <p className="foundation-meaning">{open.plainMeaning}</p>
          <p><strong>Aurora example. </strong>{open.auroraExample}</p>
          <p><strong>Why it matters later. </strong>{open.whyItMattersLater}</p>
          <div className="foundation-check">
            <p>{open.check.prompt}</p>
            {revealedId === open.id ? <p className="foundation-reveal">{open.check.reveal}</p> : (
              <button type="button" onClick={() => setRevealedId(open.id)}>Reveal answer</button>
            )}
          </div>
          <a href={`#/foundations/${open.id}`}>Open in Foundation Bridge<ArrowRight /></a>
        </section>
      ) : null}
    </div>
  );
}
