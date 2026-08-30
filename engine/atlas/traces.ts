import type { ConceptId } from '@/content/concepts';

export type TraceStep = { conceptId: ConceptId; message: string };

export const dataTraceSteps: TraceStep[] = [
  { conceptId: 'sources', message: 'Order #10482 begins in Aurora Outfitters’ operational sales database.' },
  { conceptId: 'onelake', message: 'The order lands in OneLake as governed, reusable data.' },
  { conceptId: 'warehouse', message: 'A warehouse transformation shapes it into FactSales at order-line grain.' },
  { conceptId: 'semantic-model', message: 'The semantic model relates FactSales to shared product, date, and region dimensions.' },
  { conceptId: 'report', message: 'A report measure turns the modeled rows into a visible sales result.' },
];

export const queryTraceSteps: TraceStep[] = [
  { conceptId: 'report', message: 'A report visual requests revenue for the current product and region filters.' },
  { conceptId: 'semantic-model', message: 'The semantic model translates the request into model-aware calculations.' },
  { conceptId: 'warehouse', message: 'The warehouse answers the relational query path for this scenario.' },
];

export const dataTrace = dataTraceSteps.map(({ conceptId }) => conceptId);
export const queryTrace = queryTraceSteps.map(({ conceptId }) => conceptId);

export function getTraceStep(mode: 'data' | 'query', step: number): TraceStep {
  const steps = mode === 'data' ? dataTraceSteps : queryTraceSteps;
  if (!Number.isInteger(step) || step < 0 || step >= steps.length) {
    throw new RangeError(`Trace step ${step} is outside the ${mode} trace.`);
  }
  return steps[step];
}
