import type { ExamScenario } from '@/content/exam-practice';

export const DEFAULT_ABILITY = 2;

export function updateAbility(
  ability: number,
  difficulty: number,
  correct: boolean,
) {
  const expected = 1 / (1 + Math.pow(2, difficulty - ability));
  const next = ability + 0.75 * ((correct ? 1 : 0) - expected);
  return Math.max(1, Math.min(4, next));
}

export function selectAdaptiveQuestion(
  questions: ExamScenario[],
  ability: number,
  random = Math.random,
) {
  if (!questions.length) return undefined;
  const ranked = questions
    .map((question) => ({
      question,
      distance: Math.abs(question.difficulty - ability),
    }))
    .sort((a, b) => a.distance - b.distance);
  const nearest = ranked.filter(
    ({ distance }) => distance === ranked[0].distance,
  );
  return nearest[Math.floor(random() * nearest.length)].question;
}

export function difficultyLabel(ability: number) {
  if (ability < 1.75) return 'Foundation';
  if (ability < 2.75) return 'Core';
  if (ability < 3.5) return 'Applied';
  return 'Advanced';
}
