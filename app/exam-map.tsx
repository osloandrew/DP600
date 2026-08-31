'use client';

import { ArrowLeft, ArrowRight, BookOpen, Check, CircleDashed, Construction, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import { exam, examObjectiveGroups, type ExamDomainId } from '@/content/exam';
import { sources } from '@/content/sources';

const stateMeta = {
  built: { label: 'Interactive lab built', icon: Check },
  partial: { label: 'Partly covered', icon: CircleDashed },
  planned: { label: 'Planned', icon: Construction },
} as const;

export function ExamMap() {
  const [domainId, setDomainId] = useState<ExamDomainId>('prepare');
  const domain = exam.domains.find((item) => item.id === domainId)!;
  const groups = useMemo(() => examObjectiveGroups.filter((group) => group.domainId === domainId), [domainId]);
  const source = sources['dp600-guide'];

  return <div className="lab-page exam-map-page">
    <header className="lab-topbar"><a href="#explore" className="lab-back"><ArrowLeft />Fabric Atlas</a><div><strong>Exam Map</strong><span>{exam.code} · Blueprint effective {exam.blueprintEffectiveDate}</span></div><span className="simulation-label">Coverage, not readiness</span></header>
    <main className="exam-map-shell">
      <section className="exam-map-intro" aria-labelledby="exam-map-heading"><p className="eyebrow">Official scope overlay</p><h1 id="exam-map-heading">See where the exam touches the system</h1><p>The outline is metadata over the explorer—not the way the material is taught. Select a domain to connect its objective areas to built and planned experiences.</p><div className="coverage-legend">{Object.entries(stateMeta).map(([state, meta]) => { const Icon = meta.icon; return <span className={`state-${state}`} key={state}><Icon />{meta.label}</span>; })}</div><aside><BookOpen /><div><strong>No readiness score</strong><p>Opening a lab is evidence of exploration, not proof of mastery.</p></div></aside></section>
      <section className="exam-map-content">
        <nav className="domain-tabs" aria-label="DP-600 domains">{exam.domains.map((item) => <button key={item.id} className={item.id === domainId ? 'active' : ''} onClick={() => setDomainId(item.id)}><span>{item.weight}</span><strong>{item.title}</strong></button>)}</nav>
        <div className="domain-heading"><div><p className="eyebrow">Current domain</p><h2>{domain.title}</h2></div><strong>{domain.weight}<small>official weight range</small></strong></div>
        <div className="objective-grid">{groups.map((group) => <article className="objective-card" key={group.id}><header><span>{group.id.replace('-', ' ')}</span><h3>{group.title}</h3></header><p>{group.detail}</p><div className="experience-list">{group.experiences.map((experience) => { const meta = stateMeta[experience.state]; const Icon = meta.icon; const content = <><Icon /><span><strong>{experience.title}</strong><small>{meta.label}</small></span>{experience.href ? <ArrowRight /> : null}</>; return experience.href ? <a className={`state-${experience.state}`} href={experience.href} key={experience.title}>{content}</a> : <div className={`state-${experience.state}`} key={experience.title}>{content}</div>; })}</div></article>)}</div>
        <footer className="exam-source"><div><BookOpen /><span><small>Scope source</small><strong>{source.title}</strong></span></div><a href={source.url} target="_blank" rel="noreferrer">Open Microsoft Learn <ExternalLink /></a></footer>
      </section>
    </main>
  </div>;
}
