'use client';

import { Check, Eye, GraduationCap, Lightbulb } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import type { JourneyPractice as JourneyPracticeDefinition } from '@/content/journey-practice';
import type { JourneyPracticeProgress } from '@/lib/progress';

type TaskKind = 'guided' | 'independent';

export function JourneyPractice({ practice, progress, onComplete }: {
  practice: JourneyPracticeDefinition;
  progress: JourneyPracticeProgress;
  onComplete: (step: keyof JourneyPracticeProgress) => void;
}) {
  const [selection, setSelection] = useState<Record<TaskKind, string | undefined>>({ guided: undefined, independent: undefined });
  const [submitted, setSubmitted] = useState<Partial<Record<TaskKind, boolean>>>({});
  const submit = (kind: TaskKind) => {
    const task = practice[kind];
    const selected = selection[kind];
    if (!selected) return;
    setSubmitted((current) => ({ ...current, [kind]: true }));
    if (selected === task.answerId) onComplete(kind === 'guided' ? 'guidedComplete' : 'independentComplete');
  };
  const task = (kind: TaskKind, title: string, icon: ReactNode, locked: boolean) => {
    const definition = practice[kind];
    const selected = selection[kind];
    const hasSubmitted = submitted[kind];
    const correct = selected === definition.answerId;
    const completed = kind === 'guided' ? progress.guidedComplete : progress.independentComplete;
    return <section className={`journey-practice-card ${completed ? 'is-complete' : ''} ${locked ? 'is-locked' : ''}`}>
      <header>{icon}<div><p className="eyebrow">{title}</p><h2>{definition.mission}</h2></div>{completed ? <span className="journey-practice-state"><Check />Complete</span> : null}</header>
      {kind === 'guided' ? <p className="journey-practice-hint"><Lightbulb />{practice.guided.hint}</p> : null}
      {locked ? <p className="journey-practice-locked">Complete the guided assignment first. The variation removes the hint so you can apply the same rule in a new situation.</p> : <>
        <fieldset className="journey-practice-options"><legend className="sr-only">{title}</legend>
          {definition.choices.map((choice) => <label key={choice.id} className={selected === choice.id ? 'is-selected' : ''}><input type="radio" name={kind} checked={selected === choice.id} onChange={() => { setSelection((current) => ({ ...current, [kind]: choice.id })); setSubmitted((current) => ({ ...current, [kind]: false })); }} />{choice.label}</label>)}
        </fieldset>
        {hasSubmitted && selected ? <output className={`journey-practice-feedback ${correct ? 'is-right' : 'is-review'}`}><strong>{correct ? 'That fits the requirement.' : 'Recheck the deciding requirement.'}</strong><p>{definition.choices.find((choice) => choice.id === selected)?.feedback}</p>{correct ? <p>{definition.debrief}</p> : null}</output> : null}
        {!completed ? <Button variant="outline" onClick={() => submit(kind)} disabled={!selected}>Check this decision</Button> : null}
      </>}
    </section>;
  };

  return <section className="journey-practice" aria-labelledby="journey-practice-title">
    <div className="journey-practice-heading"><p className="eyebrow">Apply what you saw</p><h2 id="journey-practice-title">From guided observation to a new situation</h2><p>The lab remains the teaching surface. These short decisions make the rule explicit after you have inspected the system.</p></div>
    <section className={`journey-practice-card journey-worked-example ${progress.workedExample ? 'is-complete' : ''}`}>
      <header><Eye /><div><p className="eyebrow">Watch me</p><h2>{practice.workedExample.title}</h2></div>{progress.workedExample ? <span className="journey-practice-state"><Check />Observed</span> : null}</header>
      <p>{practice.workedExample.instruction}</p><p className="journey-practice-observation"><strong>Notice:</strong> {practice.workedExample.observation}</p>
      {!progress.workedExample ? <Button variant="outline" onClick={() => onComplete('workedExample')}>I inspected this in the lab</Button> : null}
    </section>
    {task('guided', 'Do it with me', <GraduationCap />, !progress.workedExample)}
    {task('independent', 'You try', <GraduationCap />, !progress.guidedComplete)}
  </section>;
}
