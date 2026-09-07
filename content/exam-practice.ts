import questionData from '@/data/exam-practice.json';

export type ExamPracticeOption = {
  id: string;
  label: string;
  explanation: string;
  misconceptionId: string | null;
};

export type ExamCognitiveSkill =
  | 'recall'
  | 'interpret'
  | 'apply'
  | 'troubleshoot'
  | 'evaluate';
export type ExamQuestionFormat = 'single-choice';
export type ExamScenarioType =
  | 'design'
  | 'security'
  | 'governance'
  | 'transformation'
  | 'query'
  | 'performance'
  | 'operations';
export type ExamContentStatus = 'draft' | 'reviewed' | 'verified';

export type ExamScenario = {
  id: string;
  difficulty: 1 | 2 | 3 | 4;
  domain: string;
  objectiveIds: string[];
  skill: ExamCognitiveSkill;
  format: ExamQuestionFormat;
  scenarioType: ExamScenarioType;
  status: ExamContentStatus;
  verifiedDate: string;
  title: string;
  context: string;
  question: string;
  options: ExamPracticeOption[];
  answerId: string;
  decisiveClue: string;
  sourceId: string;
  remediation: { label: string; href: string };
};

export const examScenarios = questionData.questions.map((scenario) => ({
  ...scenario,
  options: scenario.options.map((option) => ({
    ...option,
    misconceptionId: option.id === scenario.answerId ? null : option.id,
  })),
})) as ExamScenario[];
