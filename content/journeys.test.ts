import { describe, expect, it } from 'vitest';
import { foundations } from './foundations';
import { journeys, journeyStops } from './journeys';
import { journeyPractice } from './journey-practice';

describe('journey registry', () => {
  it('resolves every journey stop id to a defined stop', () => {
    for (const journey of Object.values(journeys)) {
      for (const stopId of journey.stopIds) expect(journeyStops[stopId]).toBeDefined();
    }
  });

  it('keeps every stop pointed at its own journey', () => {
    for (const journey of Object.values(journeys)) {
      for (const stopId of journey.stopIds) expect(journeyStops[stopId].journeyId).toBe(journey.id);
    }
  });

  it('references only real foundation concepts', () => {
    for (const stop of Object.values(journeyStops)) {
      for (const id of stop.prerequisiteFoundationIds) expect(foundations[id]).toBeDefined();
    }
  });

  it('gives every stop a hash route into an existing lab', () => {
    for (const stop of Object.values(journeyStops)) expect(stop.labHref.startsWith('#')).toBe(true);
  });

  it('gives every stop a general rule and exam lens', () => {
    for (const stop of Object.values(journeyStops)) {
      expect(stop.generalRule.length).toBeGreaterThan(0);
      expect(stop.examLens.objectiveIds.length).toBeGreaterThan(0);
      expect(stop.examLens.scenario.length).toBeGreaterThan(0);
    }
  });

  it('has no orphaned stops outside a journey’s stopIds', () => {
    const referenced = new Set(Object.values(journeys).flatMap((journey) => journey.stopIds));
    for (const stopId of Object.keys(journeyStops)) expect(referenced.has(stopId)).toBe(true);
  });

  it('gives every stop a worked example, guided assignment, and independent variation', () => {
    for (const stopId of Object.keys(journeyStops)) {
      const practice = journeyPractice[stopId];
      expect(practice).toBeDefined();
      expect(practice.workedExample.instruction.length).toBeGreaterThan(0);
      expect(practice.guided.choices.some((choice) => choice.id === practice.guided.answerId)).toBe(true);
      expect(practice.independent.choices.some((choice) => choice.id === practice.independent.answerId)).toBe(true);
    }
  });
});
