'use client';

import { ArrowLeft, ExternalLink, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { ExamScenario } from '@/content/exam-practice';
import type { ExamPracticeOption } from '@/content/exam-practice';
import { examScenarios } from '@/content/exam-practice';
import { sources } from '@/content/sources';
import {
  DEFAULT_ABILITY,
  difficultyLabel,
  selectAdaptiveQuestion,
  updateAbility,
} from '@/engine/quiz/adaptive';
import { playQuizSound } from '@/engine/quiz/sounds';

const ABILITY_KEY = 'dp600-quiz-ability-v1';
const SOUND_KEY = 'dp600-quiz-sound-v1';
type Phase = 'intro' | 'playing' | 'summary';

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function savedAbility() {
  if (typeof window === 'undefined') return DEFAULT_ABILITY;
  const value = Number(window.localStorage.getItem(ABILITY_KEY));
  return value >= 1 && value <= 4 ? value : DEFAULT_ABILITY;
}

function savedSoundPreference() {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(SOUND_KEY) !== 'off';
}

export function QuizMode() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [roundSize, setRoundSize] = useState(10);
  const [ability, setAbility] = useState(savedAbility);
  const [question, setQuestion] = useState<ExamScenario>();
  const [options, setOptions] = useState<ExamPracticeOption[]>([]);
  const [remaining, setRemaining] = useState<ExamScenario[]>([]);
  const [asked, setAsked] = useState<ExamScenario[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [flagged, setFlagged] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(savedSoundPreference);
  const reviewIds = [...new Set([...missed, ...flagged])];

  const playSound = (sound: Parameters<typeof playQuizSound>[0]) => {
    if (soundEnabled) playQuizSound(sound);
  };

  const startRound = (
    size = roundSize,
    sourceQuestions: ExamScenario[] = examScenarios,
  ) => {
    playSound('popChime');
    const pool = [...sourceQuestions];
    const first = selectAdaptiveQuestion(pool, ability)!;
    setRoundSize(Math.min(size, pool.length));
    setQuestion(first);
    setOptions(shuffle(first.options));
    setRemaining(pool.filter((item) => item.id !== first.id));
    setAsked([first]);
    setSelectedId(undefined);
    setAnswered(false);
    setCorrect(0);
    setStreak(0);
    setMissed([]);
    setFlagged([]);
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
      playSound(
        streak > 0 && (streak + 1) % 3 === 0 ? 'streakChime' : 'goodChime',
      );
      setCorrect((value) => value + 1);
      setStreak((value) => value + 1);
    } else {
      playSound('badChime');
      setStreak(0);
      setMissed((value) => [...value, question.id]);
    }
  };

  const next = () => {
    if (asked.length >= roundSize || !remaining.length) {
      playSound(
        missed.length === 0 ? 'queueClearedChime' : 'roundCompleteChime',
      );
      setPhase('summary');
      return;
    }
    const nextQuestion = selectAdaptiveQuestion(
      remaining,
      ability,
      Math.random,
      question?.domain,
    )!;
    setQuestion(nextQuestion);
    setOptions(shuffle(nextQuestion.options));
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

  const toggleFlag = () => {
    if (!question) return;
    setFlagged((items) =>
      items.includes(question.id)
        ? items.filter((id) => id !== question.id)
        : [...items, question.id],
    );
  };

  const toggleSound = () => {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);
    window.localStorage.setItem(SOUND_KEY, nextValue ? 'on' : 'off');
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
            scenario for your current practice level. There is no timer. Take as
            long as you need.
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
              Practice level: <strong>{difficultyLabel(ability)}</strong>. This
              guides the next question; it is not an exam score or a judgment of
              readiness.
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
              <button className="game-intro-option" onClick={toggleSound}>
                <span className="game-intro-option-count">
                  {soundEnabled ? '♪' : '—'}
                </span>
                <span className="game-intro-option-label">
                  Sound {soundEnabled ? 'on' : 'off'}
                </span>
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
            {reviewIds.length > 0 && (
              <div className="dp-quiz-review">
                <strong>Review when you feel ready</strong>
                {reviewIds.map((id) => {
                  const item = examScenarios.find((entry) => entry.id === id)!;
                  return (
                    <a href={item.remediation.href} key={id}>
                      {item.title}
                    </a>
                  );
                })}
              </div>
            )}
            {reviewIds.length > 0 && (
              <button
                className="game-summary-primary-btn"
                onClick={() =>
                  startRound(
                    reviewIds.length,
                    examScenarios.filter((item) => reviewIds.includes(item.id)),
                  )
                }
              >
                Practice review set
              </button>
            )}
            <button
              className="game-summary-secondary-btn"
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
              <div className="game-stats-progress-wrapper">
                <p className="game-progress-heading">
                  Question {asked.length} of {roundSize}
                </p>
                <div className="game-session-progress-bg">
                  <div
                    className="game-session-progress-fill"
                    style={{ width: `${(asked.length / roundSize) * 100}%` }}
                  />
                </div>
              </div>
              <div className="game-stat-pills" aria-label="Round status">
                <span>
                  <strong>{streak}</strong> in a row
                </span>
                <span>
                  <strong>{reviewIds.length}</strong> to review
                </span>
              </div>
            </div>
            <button className="dp-quiz-flag" onClick={toggleFlag}>
              {flagged.includes(question.id)
                ? 'Marked for later review'
                : 'Review this later'}
            </button>
          </div>
          <section className="game-word-card">
            <div className="dp-quiz-question-meta">
              <span>{question.domain}</span>
              <span>Choose one answer</span>
            </div>
            <div className="dp-quiz-scenario">
              <p className="game-instruction">Scenario</p>
              <p className="dp-quiz-context">{question.context}</p>
            </div>
            <div className="game-word game-prompt-extra-long">
              <h2>{question.question}</h2>
            </div>
          </section>
          <div className="game-grid">
            {options.map((option, optionIndex) => {
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
                  <span className="dp-quiz-option-letter">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span>{option.label}</span>
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
                    ? 'That’s it.'
                    : 'Not yet — here’s the distinction.'}
                </strong>
                <span>
                  {
                    question.options.find((option) => option.id === selectedId)
                      ?.explanation
                  }
                </span>
                {selectedId !== question.answerId && (
                  <span>
                    <strong>Best answer: </strong>
                    {
                      question.options.find(
                        (option) => option.id === question.answerId,
                      )?.explanation
                    }
                  </span>
                )}
                <details className="dp-quiz-feedback-detail">
                  <summary>Why this is the best answer</summary>
                  <span>{question.decisiveClue}</span>
                  <a
                    href={sources[question.sourceId].url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Verified with {sources[question.sourceId].title}
                    <ExternalLink />
                  </a>
                </details>
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
