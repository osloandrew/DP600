'use client';

import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, Compass, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createSprintPlan } from '@/engine/exam-sprint/model';
import { readExamDate, readProgress, recordExamDate } from '@/lib/progress';

const iconByKind = { foundation: Sparkles, guided: Compass, independent: CheckCircle2, retrieval: Clock3, exam: CalendarDays };
const today = new Date().toISOString().slice(0, 10);

export function ExamSprint() {
  const [examDate, setExamDate] = useState(() => readExamDate() ?? '');
  const [savedDate, setSavedDate] = useState(() => readExamDate());
  const progress = readProgress();
  const plan = useMemo(() => savedDate ? createSprintPlan(progress, today, savedDate) : undefined, [progress, savedDate]);
  const saveDate = () => { if (!examDate) return; recordExamDate(examDate); setSavedDate(examDate); };

  return <div className="lab-page sprint-page"><header className="lab-topbar"><a href="#/exam" className="lab-back"><ArrowLeft />Exam Prep</a><div><strong>Exam Sprint</strong><span>A small, evidence-led study queue</span></div><span className="simulation-label">Optional planning</span></header><main className="sprint-shell"><section className="sprint-intro"><p className="eyebrow">Optional exam-date support</p><h1>Choose a date. Keep today’s work small.</h1><p>The sprint uses current learning evidence and DP-600 domain weighting to suggest a practical queue. It never estimates whether you will pass.</p><label className="sprint-date"><span>Exam date</span><input type="date" min={today} value={examDate} onChange={(event) => setExamDate(event.target.value)} /><Button onClick={saveDate} disabled={!examDate}>Set date</Button></label>{savedDate ? <p className="sprint-date-note">Your date is saved only in this browser. Change or clear it whenever your plan changes.</p> : null}</section>{plan ? <section className="sprint-plan" aria-labelledby="sprint-plan-title"><header><div><p className="eyebrow">Today’s sprint</p><h2 id="sprint-plan-title">{plan.daysUntilExam > 0 ? `${plan.daysUntilExam} days until your exam` : 'Exam day'}</h2></div><span>{plan.items.length} focused steps</span></header><ol>{plan.items.map((item) => { const Icon = iconByKind[item.kind]; return <li key={item.id}><span className={`sprint-item-icon is-${item.kind}`}><Icon /></span><div><small>{item.duration}</small><h3>{item.title}</h3><p>{item.detail}</p></div><a href={item.href} aria-label={`Open ${item.title}`}><ArrowRight /></a></li>; })}</ol><aside><strong>What this is based on</strong><p>Foundation gaps, incomplete guided or independent work, retrieval after completed work, and Prepare data’s 45–50% official weight. This is a study order, not a readiness score.</p></aside></section> : <section className="sprint-empty"><CalendarDays /><h2>Set an exam date to create a small study queue.</h2><p>You can still explore freely or use scenario practice without one.</p><a href="#/exam">Open Exam Prep <ArrowRight /></a></section>}</main></div>;
}
