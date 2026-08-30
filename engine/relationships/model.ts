export type RelationshipScenario = 'star' | 'bridge';
export type FilterDirection = 'single' | 'both';

export type RelationshipResult = {
  activeNodes: string[];
  visibleSales: number;
  visibleCustomers: number;
  explanation: string;
  caution?: string;
};

export function evaluateRelationship(scenario: RelationshipScenario, direction: FilterDirection): RelationshipResult {
  if (scenario === 'bridge') {
    return {
      activeNodes: ['promotion', 'bridge', 'product', 'sales'],
      visibleSales: 184,
      visibleCustomers: direction === 'both' ? 96 : 312,
      explanation: 'The promotion filter crosses the bridge at one row per promotion–product pairing, then reaches products and their sales.',
      caution: direction === 'both'
        ? 'Both-direction filtering can make other promotions appear filtered through shared products. Use it only when that behavior is intentional.'
        : 'The bridge resolves the many-to-many match without allowing sales to filter back into unrelated promotions.',
    };
  }

  return {
    activeNodes: direction === 'both' ? ['product', 'sales', 'customer'] : ['product', 'sales'],
    visibleSales: 248,
    visibleCustomers: direction === 'both' ? 137 : 312,
    explanation: direction === 'both'
      ? 'Product filters reach FactSales, then travel back through the bidirectional customer relationship.'
      : 'Product filters flow from the one side into FactSales. DimCustomer remains an independent filter table.',
    caution: direction === 'both'
      ? 'The extra path changes which customers remain visible and can create ambiguity in a larger model.'
      : undefined,
  };
}
