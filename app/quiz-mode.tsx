'use client';

import { ArrowLeft, ExternalLink, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { ExamScenario } from '@/content/exam-practice';
import { examScenarios } from '@/content/exam-practice';
import { sources } from '@/content/sources';
import {
  DEFAULT_ABILITY,
  difficultyLabel,
  selectAdaptiveQuestion,
  updateAbility,
} from '@/engine/quiz/adaptive';

const ABILITY_KEY = 'dp600-quiz-ability-v1';
type Phase = 'intro' | 'playing' | 'summary';

function savedAbility() {
  if (typeof window === 'undefined') return DEFAULT_ABILITY;
  const value = Number(window.localStorage.getItem(ABILITY_KEY));
  return value >= 1 && value <= 4 ? value : DEFAULT_ABILITY;
}

export function QuizMode() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [roundSize, setRoundSize] = useState(10);
  const [ability, setAbility] = useState(savedAbility);
  const [question, setQuestion] = useState<ExamScenario>();
  const [remaining, setRemaining] = useState<ExamScenario[]>([]);
  const [asked, setAsked] = useState<ExamScenario[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);

  const startRound = (size = roundSize) => {
    const pool = [...examScenarios];
    const first = selectAdaptiveQuestion(pool, ability)!;
    setRoundSize(Math.min(size, pool.length));
    setQuestion(first);
    setRemaining(pool.filter((item) => item.id !== first.id));
    setAsked([first]);
    setSelectedId(undefined);
    setAnswered(false);
    setCorrect(0);
    setStreak(0);
    setMissed([]);
    setPhase('playing');
  };

  const choose = (id: string) => {
    if (!question || answered) return;
    const wasCorrect = id === question.answerId;
    const nextAbility = updateAbility(ability, question.difficulty, wasCorrect);
    setSelectedId(id);
    setAnswered(true);
    setAbility(nextAbility);
    window.localStorage.setItem(ABILITY_KEY, String(nextAbility));
    if (wasCorrect) {
      setCorrect((value) => value + 1);
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
      setMissed((value) => [...value, question.id]);
    }
  };

  const next = () => {
    if (asked.length >= roundSize || !remaining.length) {
      setPhase('summary');
      return;
    }
    const nextQuestion = selectAdaptiveQuestion(remaining, ability)!;
    setQuestion(nextQuestion);
    setRemaining((items) =>
      items.filter((item) => item.id !== nextQuestion.id),
    );
    setAsked((items) => [...items, nextQuestion]);
    setSelectedId(undefined);
    setAnswered(false);
  };

  const resetDifficulty = () => {
    setAbility(DEFAULT_ABILITY);
    window.localStorage.removeItem(ABILITY_KEY);
  };

  return (
    <div className="dp-quiz-page">
      <header className="dp-quiz-header">
        <a href="#/">
          <ArrowLeft /> Fabric Explorer
        </a>
        <strong>DP-600 Quiz</strong>
        <span>
          {phase === 'playing' && question
            ? question.domain
            : 'Adaptive practice'}
        </span>
      </header>

      {phase === 'intro' ? (
        <main className="dp-quiz-shell game-intro-screen">
          <h1 className="game-intro-heading">Ready to practice?</h1>
          <p className="game-intro-subheading">
            The round adapts after every answer, choosing the best next DP-600
            scenario for your current level.
          </p>
          <section className="game-intro-card game-today-practice">
            <div className="game-today-practice-heading-row">
              <div>
                <p className="game-today-practice-eyebrow">Today’s practice</p>
                <h2>Adaptive DP-600 round</h2>
              </div>
              <span className="game-today-practice-count">{roundSize}</span>
            </div>
            <p className="game-today-practice-note">
              Starting level: <strong>{difficultyLabel(ability)}</strong>. Your
              next question becomes harder or easier based on your answer.
            </p>
            <div className="game-today-practice-progress" aria-hidden="true">
              <span style={{ width: `${(ability / 4) * 100}%` }} />
            </div>
            <button
              className="game-today-practice-btn"
              onClick={() => startRound()}
            >
              Start practice
            </button>
          </section>
          <details className="game-more-practice">
            <summary>More practice options</summary>
            <div className="game-intro-options">
              <button
                className="game-intro-option"
                onClick={() => startRound(5)}
              >
                <span className="game-intro-option-count">5</span>
                <span className="game-intro-option-label">Quick round</span>
              </button>
              <button className="game-intro-option" onClick={resetDifficulty}>
                <span className="game-intro-option-count">↺</span>
                <span className="game-intro-option-label">Reset level</span>
              </button>
            </div>
          </details>
        </main>
      ) : phase === 'summary' ? (
        <main className="dp-quiz-shell">
          <section className="game-summary-card">
            <div className="game-summary-hero">
              <span className="game-summary-check">✓</span>
              <h1 className="game-summary-heading">Round complete</h1>
              <p>
                Your next round will begin at {difficultyLabel(ability)} level.
              </p>
            </div>
            <div className="game-summary-stats">
              <div className="game-summary-stat">
                <p className="game-summary-stat-value">{correct}</p>
                <p className="game-summary-stat-label">Correct</p>
              </div>
              <div className="game-summary-stat">
                <p className="game-summary-stat-value">
                  {asked.length - correct}
                </p>
                <p className="game-summary-stat-label">To review</p>
              </div>
            </div>
            {missed.length > 0 && (
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
            )}
            <button
              className="game-summary-primary-btn"
              onClick={() => startRound()}
            >
              <RotateCcw /> Play again
            </button>
            <div className="game-summary-actions">
              <a className="game-summary-secondary-btn" href="#/">
                Return to Fabric Explorer
              </a>
            </div>
          </section>
        </main>
      ) : question ? (
        <main className="dp-quiz-shell">
          <div className="game-stats-wrapper">
            <div className="game-stats-content">
              <div className="game-stats-correct-box">
                <p id="streak-count">{streak}</p>
                <p className="game-stat-label">Correct in a row</p>
              </div>
              <div className="game-stats-progress-wrapper">
                <p className="game-progress-heading">
                  Question {asked.length} of {roundSize} ·{' '}
                  {difficultyLabel(ability)}
                </p>
                <div className="game-session-progress-bg">
                  <div
                    className="game-session-progress-fill"
                    style={{ width: `${(asked.length / roundSize) * 100}%` }}
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
            {answered && (
              <div
                className={
                  selectedId === question.answerId
                    ? 'is-correct'
                    : 'is-incorrect'
                }
              >
                <strong>
                  {selectedId === question.answerId
                    ? 'Correct.'
                    : 'Review this one.'}
                </strong>
                <span>{question.decisiveClue}</span>
                <a
                  href={sources[question.sourceId].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Verified with {sources[question.sourceId].title}
                  <ExternalLink />
                </a>
              </div>
            )}
          </div>
          <div className="game-next-button-container">
            <button
              type="button"
              id="game-next-word-button"
              disabled={!answered}
              onClick={next}
            >
              {asked.length >= roundSize ? 'See results' : 'Next question'}
            </button>
          </div>
        </main>
      ) : null}
    </div>
  );
}
