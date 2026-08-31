export type IncrementalPolicy = { storeMonths: 12 | 24; refreshDays: 7 | 30 | 60; realtime: boolean };
export type PartitionKind = 'historical' | 'refresh' | 'realtime';
export type IncrementalPartition = { id: string; label: string; range: string; kind: PartitionKind; processed: boolean };

const DAY = 86_400_000;
const iso = (value: Date) => value.toISOString().slice(0, 10);
const shiftDays = (value: Date, days: number) => new Date(value.getTime() + days * DAY);

export function evaluateIncrementalRefresh(policy: IncrementalPolicy, currentDate: string, lateChange: boolean, refreshRun: boolean) {
  const now = new Date(`${currentDate}T00:00:00Z`);
  const refreshStart = shiftDays(now, -policy.refreshDays);
  const archiveStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - policy.storeMonths, 1));
  const historySplit = new Date(Date.UTC(refreshStart.getUTCFullYear(), refreshStart.getUTCMonth(), 1));
  const lateOrder = new Date('2026-08-12T00:00:00Z');
  const lateChangeCovered = lateOrder >= refreshStart && lateOrder < now;
  const visibleRevenue = lateChange && refreshRun && lateChangeCovered ? 1250 : 1000;
  const processedKinds: PartitionKind[] = refreshRun ? ['refresh'] : [];
  const partitions: IncrementalPartition[] = [
    { id: 'archive', label: 'Historical archive', range: `${iso(archiveStart)} → ${iso(historySplit)}`, kind: 'historical', processed: false },
  ];
  if (historySplit < refreshStart) partitions.push({ id: 'recent-history', label: 'Recent history', range: `${iso(historySplit)} → ${iso(refreshStart)}`, kind: 'historical', processed: false });
  partitions.push({ id: 'refresh-window', label: 'Incremental window', range: `${iso(refreshStart)} → ${iso(now)}`, kind: 'refresh', processed: refreshRun });
  if (policy.realtime) partitions.push({ id: 'realtime', label: 'Latest data', range: `After ${iso(now)}`, kind: 'realtime', processed: false });

  return {
    partitions,
    processedKinds,
    refreshStart: iso(refreshStart),
    archiveStart: iso(archiveStart),
    lateChangeCovered,
    visibleRevenue,
    sourceRevenue: lateChange ? 1250 : 1000,
    explanation: !lateChange
      ? 'All partitions match the source. Change the old August order to test the policy window.'
      : !refreshRun
        ? 'The source changed, but the imported partition has not been processed yet.'
        : lateChangeCovered
          ? `The order falls inside the ${policy.refreshDays}-day refresh window, so the incremental partition picks up the correction.`
          : `The order is older than ${iso(refreshStart)}. It sits in a historical partition that this refresh leaves untouched.`,
  };
}

export const incrementalAccuracyNote = 'The service creates and manages finer-grained partitions automatically. This compact timeline groups them to make the rolling-window policy observable.';
