import questionData from '@/data/exam-practice.json';

export type ExamPracticeOption = {
  id: string;
  label: string;
  explanation: string;
};

export type ExamScenario = {
  id: string;
  difficulty: 1 | 2 | 3 | 4;
  domain: string;
  objectiveIds: string[];
  title: string;
  context: string;
  question: string;
  options: ExamPracticeOption[];
  answerId: string;
  decisiveClue: string;
  sourceId: string;
  remediation: { label: string; href: string };
};

export const examScenarios = questionData as ExamScenario[];
