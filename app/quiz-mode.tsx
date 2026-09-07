'use client';

import { ArrowLeft, ExternalLink, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { examScenarios } from '@/content/exam-practice';
import { sources } from '@/content/sources';

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export function QuizMode() {
  const [questions, setQuestions] = useState(() => shuffle(examScenarios));
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string>();
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const question = questions[index];
  const finished = index >= questions.length;

  const restart = () => {
    setQuestions(shuffle(examScenarios));
    setIndex(0);
    setSelectedId(undefined);
    setAnswered(false);
    setCorrect(0);
    setMissed([]);
  };

  if (finished)
    return (
      <div className="dp-quiz-page">
        <header className="dp-quiz-header">
          <a href="#/">
            <ArrowLeft />
            Fabric Explorer
          </a>
          <strong>DP-600 Quiz</strong>
        </header>
        <main className="dp-quiz-shell">
          <section className="game-summary-card">
            <div className="game-summary-hero">
              <span className="game-summary-check">✓</span>
              <h1 className="game-summary-heading">Round complete</h1>
            </div>
            <div className="game-summary-stats">
              <div className="game-summary-stat">
                <strong>{correct}</strong>
                <span>Correct</span>
              </div>
              <div className="game-summary-stat">
                <strong>{questions.length - correct}</strong>
                <span>To review</span>
              </div>
            </div>
            {missed.length ? (
              <div className="dp-quiz-review">
                <strong>Review these scenarios</strong>
                {missed.map((id) => {
                  const item = examScenarios.find((entry) => entry.id === id)!;
                  return (
                    <a href={item.remediation.href} key={id}>
                      {item.title}
                    </a>
                  );
                })}
              </div>
            ) : null}
            <button className="game-summary-primary-btn" onClick={restart}>
              <RotateCcw />
              Play again
            </button>
            <a className="game-summary-secondary-btn" href="#/exam">
              Return to Exam Prep
            </a>
          </section>
        </main>
      </div>
    );

  const source = sources[question.sourceId];
  const choose = (id: string) => {
    if (answered) return;
    setSelectedId(id);
    setAnswered(true);
    if (id === question.answerId) setCorrect((value) => value + 1);
    else setMissed((value) => [...value, question.id]);
  };
  const next = () => {
    setIndex((value) => value + 1);
    setSelectedId(undefined);
    setAnswered(false);
  };

  return (
    <div className="dp-quiz-page">
      <header className="dp-quiz-header">
        <a href="#/">
          <ArrowLeft />
          Fabric Explorer
        </a>
        <strong>DP-600 Quiz</strong>
        <span>{question.domain}</span>
      </header>
      <main className="dp-quiz-shell">
        <div className="game-stats-wrapper">
          <div className="game-stats-content">
            <div className="game-stats-correct-box">
              <p id="streak-count">{correct}</p>
              <p className="game-stat-label">Correct</p>
            </div>
            <div className="game-stats-progress-wrapper">
              <p className="game-progress-heading">
                Question {index + 1} of {questions.length}
              </p>
              <div className="game-session-progress-bg">
                <div
                  className="game-session-progress-fill"
                  style={{
                    width: `${((index + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="game-stats-incorrect-box">
              <p id="review-count">{missed.length}</p>
              <p className="game-stat-label">To Review</p>
            </div>
          </div>
        </div>
        <section className="game-word-card">
          <p className="game-instruction">Choose the best answer</p>
          <span className="game-cefr-label medium">
            {question.objectiveIds[0]}
          </span>
          <div className="game-word game-prompt-extra-long">
            <h2>{question.question}</h2>
          </div>
          <p className="dp-quiz-context">{question.context}</p>
        </section>
        <div className="game-grid">
          {question.options.map((option) => {
            const className =
              answered && option.id === question.answerId
                ? 'game-translation-card game-correct-card'
                : answered && option.id === selectedId
                  ? 'game-translation-card game-incorrect-card'
                  : 'game-translation-card';
            return (
              <button
                type="button"
                className={className}
                key={option.id}
                disabled={answered}
                onClick={() => choose(option.id)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="game-answer-status" aria-live="polite">
          {answered ? (
            <div
              className={
                selectedId === question.answerId ? 'is-correct' : 'is-incorrect'
              }
            >
              <strong>
                {selectedId === question.answerId
                  ? 'Correct.'
                  : 'Review this one.'}
              </strong>
              <span>{question.decisiveClue}</span>
              <a href={source.url} target="_blank" rel="noreferrer">
                Verified with {source.title}
                <ExternalLink />
              </a>
            </div>
          ) : null}
        </div>
        <div className="game-next-button-container">
          <button
            type="button"
            id="game-next-word-button"
            disabled={!answered}
            onClick={next}
          >
            {index === questions.length - 1 ? 'See results' : 'Next question'}
          </button>
        </div>
      </main>
    </div>
  );
}
