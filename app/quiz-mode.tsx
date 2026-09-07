'use client';

import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
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
  const [outcomes, setOutcomes] = useState<boolean[]>([]);
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
    setOutcomes([]);
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
    setOutcomes((value) => [...value, wasCorrect]);
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
        <strong>Scenario Lab</strong>
        <button
          type="button"
          className="dp-quiz-sound"
          aria-label={`Turn sound ${soundEnabled ? 'off' : 'on'}`}
          aria-pressed={soundEnabled}
          onClick={toggleSound}
        >
          {soundEnabled ? <Volume2 /> : <VolumeX />}
          <span>Sound {soundEnabled ? 'on' : 'off'}</span>
        </button>
      </header>

      {phase === 'intro' ? (
        <main className="dp-quiz-shell dp-quiz-intro">
          <p className="dp-quiz-kicker">Adaptive scenario practice</p>
          <h1>Make the call. Inspect the why.</h1>
          <p className="dp-quiz-intro-copy">
            The round adapts after every answer, choosing the best next DP-600
            scenario for your current practice level. There is no timer. Take as
            long as you need.
          </p>
          <section className="dp-quiz-intro-card">
            <div className="dp-quiz-intro-card-heading">
              <div>
                <p className="dp-quiz-eyebrow">Today’s practice</p>
                <h2>Adaptive DP-600 round</h2>
              </div>
              <span className="dp-quiz-round-count">
                <strong>{roundSize}</strong>
                <small>questions</small>
              </span>
            </div>
            <div className="dp-quiz-round-facts" aria-label="Round details">
              <span>Untimed</span>
              <span>Four choices</span>
              <span>Immediate feedback</span>
            </div>
            <p className="dp-quiz-level-note">
              Practice level: <strong>{difficultyLabel(ability)}</strong>. This
              guides the next question; it is not an exam score or a judgment of
              readiness.
            </p>
            <button
              className="dp-quiz-primary-button"
              onClick={() => startRound()}
            >
              Start practice
            </button>
          </section>
          <details className="dp-quiz-more-options">
            <summary>More practice options</summary>
            <div className="dp-quiz-option-grid">
              <button className="dp-quiz-setting" onClick={() => startRound(5)}>
                <span className="dp-quiz-setting-value">5</span>
                <span>Quick round</span>
              </button>
              <button className="dp-quiz-setting" onClick={resetDifficulty}>
                <RotateCcw />
                <span>Reset level</span>
              </button>
            </div>
          </details>
        </main>
      ) : phase === 'summary' ? (
        <main className="dp-quiz-shell">
          <section className="dp-quiz-summary">
            <div className="dp-quiz-summary-hero">
              <span className="dp-quiz-summary-check">
                <Check />
              </span>
              <p className="dp-quiz-kicker">Round complete</p>
              <h1>Nice work. Keep the useful misses.</h1>
              <p>
                Your next round will begin at {difficultyLabel(ability)} level.
              </p>
            </div>
            <div
              className="dp-quiz-result-trail"
              aria-label={`${correct} correct out of ${asked.length}`}
            >
              {outcomes.map((wasCorrect, index) => (
                <span
                  className={wasCorrect ? 'is-correct' : 'is-review'}
                  key={asked[index]?.id ?? index}
                  title={wasCorrect ? 'Correct' : 'Review'}
                />
              ))}
            </div>
            <div className="dp-quiz-summary-stats">
              <div>
                <p>{correct}</p>
                <span>Correct</span>
              </div>
              <div>
                <p>{asked.length - correct}</p>
                <span>To review</span>
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
                className="dp-quiz-primary-button"
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
              className="dp-quiz-secondary-button"
              onClick={() => startRound()}
            >
              <RotateCcw /> Play again
            </button>
            <div className="dp-quiz-summary-actions">
              <a className="dp-quiz-secondary-button" href="#/">
                Return to Fabric Explorer
              </a>
            </div>
          </section>
        </main>
      ) : question ? (
        <main className="dp-quiz-shell">
          <div className="dp-quiz-status">
            <div className="dp-quiz-status-row">
              <div className="dp-quiz-progress">
                <p>
                  Question {asked.length} of {roundSize}
                </p>
                <div className="dp-quiz-progress-track" aria-hidden="true">
                  <div
                    className="dp-quiz-progress-fill"
                    style={{ width: `${(asked.length / roundSize) * 100}%` }}
                  />
                </div>
              </div>
              <div className="dp-quiz-stat-pills" aria-label="Round status">
                <span>
                  <strong>{streak}</strong> in a row
                </span>
                <span>
                  <strong>{reviewIds.length}</strong> to review
                </span>
              </div>
            </div>
            <button
              className="dp-quiz-flag"
              aria-pressed={flagged.includes(question.id)}
              onClick={toggleFlag}
            >
              {flagged.includes(question.id) ? <BookmarkCheck /> : <Bookmark />}
              {flagged.includes(question.id)
                ? 'Marked for review'
                : 'Review later'}
            </button>
          </div>
          <section className="dp-quiz-question-card">
            <div className="dp-quiz-question-meta">
              <span>{question.domain}</span>
              <span>Choose one answer</span>
            </div>
            <div className="dp-quiz-scenario">
              <p className="dp-quiz-eyebrow">Scenario</p>
              <p className="dp-quiz-context">{question.context}</p>
            </div>
            <div className="dp-quiz-prompt">
              <h2>{question.question}</h2>
            </div>
          </section>
          <div className="dp-quiz-answer-grid">
            {options.map((option, optionIndex) => {
              const className =
                answered && option.id === question.answerId
                  ? 'dp-quiz-answer is-correct'
                  : answered && option.id === selectedId
                    ? 'dp-quiz-answer is-incorrect'
                    : 'dp-quiz-answer';
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
          <div className="dp-quiz-feedback" aria-live="polite">
            {answered && (
              <div
                className={
                  selectedId === question.answerId
                    ? 'is-correct'
                    : 'is-incorrect'
                }
              >
                <div className="dp-quiz-feedback-heading">
                  {selectedId === question.answerId ? (
                    <CheckCircle2 />
                  ) : (
                    <XCircle />
                  )}
                  <strong>
                    {selectedId === question.answerId
                      ? 'That’s it.'
                      : 'Not yet — here’s the distinction.'}
                  </strong>
                </div>
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
          <div className="dp-quiz-next">
            <button
              type="button"
              className="dp-quiz-primary-button"
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
