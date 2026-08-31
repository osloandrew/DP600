import { journeys, type JourneyId } from '@/content/journeys';

export function firstStopId(journeyId: JourneyId): string {
  return journeys[journeyId].stopIds[0];
}

export function getStopIndex(journeyId: JourneyId, stopId: string): number {
  return journeys[journeyId].stopIds.indexOf(stopId);
}

export function nextStopId(journeyId: JourneyId, stopId: string): string | undefined {
  const index = getStopIndex(journeyId, stopId);
  if (index < 0) return undefined;
  return journeys[journeyId].stopIds[index + 1];
}

export function previousStopId(journeyId: JourneyId, stopId: string): string | undefined {
  const index = getStopIndex(journeyId, stopId);
  if (index <= 0) return undefined;
  return journeys[journeyId].stopIds[index - 1];
}

export function isLastStop(journeyId: JourneyId, stopId: string): boolean {
  const stops = journeys[journeyId].stopIds;
  return stops.length > 0 && stops[stops.length - 1] === stopId;
}

export function isJourneyComplete(journeyId: JourneyId, completedStopIds: string[]): boolean {
  return journeys[journeyId].stopIds.every((id) => completedStopIds.includes(id));
}
