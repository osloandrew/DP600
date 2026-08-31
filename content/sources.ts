export type Source = { id: string; title: string; publisher: 'Microsoft Learn'; url: string; accessed: string; appliesTo: string[] };
export const sources: Record<string, Source> = {
  'dp600-guide': { id: 'dp600-guide', title: 'Study guide for Exam DP-600', publisher: 'Microsoft Learn', url: 'https://learn.microsoft.com/credentials/certifications/resources/study-guides/dp-600', accessed: '31 Aug 2026', appliesTo: ['sources', 'semantic-model', 'report'] },
  onelake: { id: 'onelake', title: 'OneLake, the OneDrive for data', publisher: 'Microsoft Learn', url: 'https://learn.microsoft.com/fabric/onelake/onelake-overview', accessed: '31 Aug 2026', appliesTo: ['onelake', 'lakehouse', 'warehouse'] },
  eventhouse: { id: 'eventhouse', title: 'Eventhouse overview', publisher: 'Microsoft Learn', url: 'https://learn.microsoft.com/fabric/real-time-intelligence/eventhouse', accessed: '31 Aug 2026', appliesTo: ['eventhouse'] },
  'semantic-models': { id: 'semantic-models', title: 'Power BI semantic models', publisher: 'Microsoft Learn', url: 'https://learn.microsoft.com/power-bi/connect-data/service-datasets-understand', accessed: '31 Aug 2026', appliesTo: ['semantic-model', 'report'] },
  'fabric-storage-options': { id: 'fabric-storage-options', title: 'Data storage options in Microsoft Fabric', publisher: 'Microsoft Learn', url: 'https://learn.microsoft.com/fabric/fundamentals/store-data', accessed: '31 Aug 2026', appliesTo: ['lakehouse', 'warehouse', 'eventhouse'] },
  'direct-lake-how': { id: 'direct-lake-how', title: 'How Direct Lake works', publisher: 'Microsoft Learn', url: 'https://learn.microsoft.com/fabric/fundamentals/direct-lake-how-it-works', accessed: '31 Aug 2026', appliesTo: ['semantic-model', 'onelake'] },
};
