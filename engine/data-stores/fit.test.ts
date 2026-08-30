import { describe, expect, it } from 'vitest';
import { evaluateStores } from './fit';

describe('data store fit model', () => {
  it('favors Warehouse for structured SQL business intelligence', () => {
    expect(evaluateStores({ dataForm: 'structured', language: 'sql', latency: 'batch', workload: 'bi' })[0]).toMatchObject({ id: 'warehouse', fit: 'Strong fit' });
  });

  it('favors Eventhouse for real-time KQL telemetry', () => {
    expect(evaluateStores({ dataForm: 'streaming', language: 'kql', latency: 'real-time', workload: 'telemetry' })[0]).toMatchObject({ id: 'eventhouse', fit: 'Strong fit' });
  });
});
