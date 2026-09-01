'use client';

import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ExternalLink, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { examScenarios } from '@/content/exam-practice';
import { sources } from '@/content/sources';

export function ExamPrep() {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const scenario = examScenarios[index];
  const selected = scenario.options.find((option) => option.id === selectedId);
  const isCorrect = selectedId === scenario.answerId;
  const move = (next: number) => { setIndex(next); setSelectedId(undefined); setSubmitted(false); };

  return <div className="lab-page exam-prep-page">
    <header className="lab-topbar"><a href="#/" className="lab-back"><ArrowLeft />Home</a><div><strong>Exam Prep</strong><span>Transfer practice after you have explored the system</span></div><span className="simulation-label">Scenario practice</span></header>
    <main className="exam-prep-shell">
      <aside className="exam-prep-intro"><p className="eyebrow">DP-600 transfer practice</p><h1>Make the decision without the diagram</h1><p>Each scenario changes the wording and removes the visual scaffolding. After answering, inspect why each plausible alternative does or does not fit, then return directly to the simulation.</p><div className="exam-prep-progress" aria-label={`Scenario ${index + 1} of ${examScenarios.length}`}><span>Scenario {index + 1} of {examScenarios.length}</span><i><b style={{ width: `${((index + 1) / examScenarios.length) * 100}%` }} /></i></div><aside><BookOpen /><div><strong>Use this after teaching</strong><p>These are compact transfer prompts, not a substitute for the field trips or an exam dump.</p></div></aside><a href="#/journeys">Continue a field trip <ArrowRight /></a></aside>
      <section className="exam-scenario" aria-labelledby="exam-scenario-title"><header><span>{scenario.domain}</span><div className="objective-list">{scenario.objectiveIds.map((id) => <small key={id}>{id}</small>)}</div></header><h2 id="exam-scenario-title">{scenario.title}</h2><p className="exam-scenario-context">{scenario.context}</p><div className="exam-scenario-question"><strong>{scenario.question}</strong></div><fieldset className="exam-options"><legend className="sr-only">Choose the best response</legend>{scenario.options.map((option) => <label key={option.id} className={selectedId === option.id ? 'is-selected' : ''}><input type="radio" name={scenario.id} checked={selectedId === option.id} onChange={() => { setSelectedId(option.id); setSubmitted(false); }} />{option.label}</label>)}</fieldset>{submitted && selected ? <section className={`exam-explanation ${isCorrect ? 'is-right' : 'is-review'}`} aria-live="polite"><header>{isCorrect ? <CheckCircle2 /> : <BookOpen />}<div><strong>{isCorrect ? 'The requirement and answer line up.' : 'One requirement points elsewhere.'}</strong><p>{scenario.decisiveClue}</p></div></header><dl>{scenario.options.map((option) => <div key={option.id} className={option.id === scenario.answerId ? 'is-answer' : ''}><dt>{option.label}</dt><dd>{option.explanation}</dd></div>)}</dl><a href={scenario.remediation.href}>{scenario.remediation.label}<ArrowRight /></a></section> : null}<footer className="exam-scenario-actions"><Button variant="outline" onClick={() => { setSelectedId(undefined); setSubmitted(false); }} disabled={!selectedId}><RotateCcw />Clear</Button><Button onClick={() => setSubmitted(true)} disabled={!selectedId}>Check decision<ArrowRight /></Button></footer><nav className="exam-scenario-nav" aria-label="Scenario navigation"><Button variant="ghost" onClick={() => move(Math.max(0, index - 1))} disabled={index === 0}>Previous</Button><Button variant="ghost" onClick={() => move(Math.min(examScenarios.length - 1, index + 1))} disabled={index === examScenarios.length - 1}>Next scenario</Button></nav></section>
    </main>
    <footer className="exam-resources"><div><strong>Use Microsoft’s official exam resources too.</strong><span>They provide the current certification details, practice assessment, and exam-environment sandbox.</span></div><div><a href={sources['dp600-certification'].url} target="_blank" rel="noreferrer">DP-600 certification <ExternalLink /></a><a href={sources['practice-assessments'].url} target="_blank" rel="noreferrer">Practice Assessment info <ExternalLink /></a></div></footer>
  </div>;
}
