export type DataForm = 'structured' | 'mixed' | 'streaming';
export type Language = 'sql' | 'spark' | 'kql';
export type Latency = 'batch' | 'near-real-time' | 'real-time';
export type Workload = 'bi' | 'engineering' | 'telemetry';
export type StoreId = 'lakehouse' | 'warehouse' | 'eventhouse';
export type Fit = 'Strong fit' | 'Possible' | 'Poor fit';

export type WorkloadProfile = { dataForm: DataForm; language: Language; latency: Latency; workload: Workload };

const strengths: Record<StoreId, Record<keyof WorkloadProfile, string[]>> = {
  lakehouse: { dataForm: ['mixed'], language: ['spark'], latency: ['batch', 'near-real-time'], workload: ['engineering'] },
  warehouse: { dataForm: ['structured'], language: ['sql'], latency: ['batch'], workload: ['bi'] },
  eventhouse: { dataForm: ['streaming'], language: ['kql'], latency: ['near-real-time', 'real-time'], workload: ['telemetry'] },
};

export function evaluateStores(profile: WorkloadProfile) {
  return (Object.keys(strengths) as StoreId[]).map((id) => {
    const score = (Object.keys(profile) as (keyof WorkloadProfile)[]).reduce(
      (total, key) => total + (strengths[id][key].includes(profile[key]) ? 1 : 0), 0,
    );
    const fit: Fit = score >= 3 ? 'Strong fit' : score >= 1 ? 'Possible' : 'Poor fit';
    return { id, score, fit };
  }).sort((a, b) => b.score - a.score);
}
