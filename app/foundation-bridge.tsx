'use client';

import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { foundationModules, foundationOrder, foundations, type FoundationConceptId } from '@/content/foundations';
import { recordFoundationVisit } from '@/lib/progress';

function initialOpenId(): FoundationConceptId | undefined {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [, id] = hash.split('/');
  return id && id in foundations ? (id as FoundationConceptId) : undefined;
}

export function FoundationBridge() {
  const [openId, setOpenId] = useState<FoundationConceptId | undefined>(initialOpenId);
  const [revealedId, setRevealedId] = useState<FoundationConceptId | undefined>(undefined);

  return (
    <div className="lab-page foundation-bridge-page">
      <header className="lab-topbar">
        <a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a>
        <div><strong>Foundation Bridge</strong><span>Prerequisite concepts for Power BI and Fabric</span></div>
        <span className="simulation-label">Foundations</span>
      </header>
      <main className="foundation-bridge">
        <div className="foundation-bridge-intro">
          <p className="eyebrow">Foundations</p>
          <h1>Before DP-600, a few basics</h1>
          <p>Concise, concrete explanations for the data and modeling vocabulary the rest of the site assumes. Skip anything you already know.</p>
        </div>
        {foundationModules.map((mod) => (
          <section key={mod.id} className="foundation-module" aria-labelledby={`module-${mod.id}`}>
            <h2 id={`module-${mod.id}`}>{mod.title}</h2>
            <p className="foundation-module-description">{mod.description}</p>
            <div className="foundation-entry-list">
              {foundationOrder.filter((id) => foundations[id].moduleId === mod.id).map((id) => {
                const foundation = foundations[id];
                const isOpen = openId === id;
                return (
                  <article key={id} className={`foundation-entry ${isOpen ? 'is-open' : ''}`}>
                    <button type="button" className="foundation-entry-toggle" aria-expanded={isOpen} onClick={() => {
                      const next = isOpen ? undefined : id;
                      setOpenId(next);
                      if (next) recordFoundationVisit(next);
                    }}>{foundation.title}</button>
                    {isOpen ? (
                      <div className="foundation-entry-body">
                        <p className="foundation-meaning">{foundation.plainMeaning}</p>
                        <p><strong>Aurora example. </strong>{foundation.auroraExample}</p>
                        <p><strong>Why it matters later. </strong>{foundation.whyItMattersLater}</p>
                        <div className="foundation-check">
                          <p>{foundation.check.prompt}</p>
                          {revealedId === id ? <p className="foundation-reveal">{foundation.check.reveal}</p> : (
                            <button type="button" onClick={() => setRevealedId(id)}>Reveal answer</button>
                          )}
                        </div>
                        <div className="foundation-related-labs">{foundation.relatedLabs.map((lab) => <a key={lab.href} href={lab.href}>{lab.label}</a>)}</div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
