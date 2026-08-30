export type TableId = 'source' | 'fact' | 'customer' | 'product' | 'store' | 'date';
export type FieldId = 'OrderLineID' | 'OrderID' | 'OrderDate' | 'CustomerID' | 'CustomerName' | 'CustomerCity' | 'ProductID' | 'ProductName' | 'ProductCategory' | 'StoreID' | 'StoreRegion' | 'Quantity' | 'UnitPrice';
export type SchemaState = Record<TableId, FieldId[]>;

export const fieldTarget: Record<FieldId, Exclude<TableId, 'source'>> = {
  OrderLineID: 'fact', OrderID: 'fact', OrderDate: 'date', CustomerID: 'customer', CustomerName: 'customer', CustomerCity: 'customer',
  ProductID: 'product', ProductName: 'product', ProductCategory: 'product', StoreID: 'store', StoreRegion: 'store', Quantity: 'fact', UnitPrice: 'fact',
};

export const relationshipKeys: Partial<Record<Exclude<TableId, 'source' | 'fact'>, FieldId>> = {
  customer: 'CustomerID', product: 'ProductID', store: 'StoreID', date: 'OrderDate',
};

export const initialSchema: SchemaState = {
  source: Object.keys(fieldTarget) as FieldId[], fact: [], customer: [], product: [], store: [], date: [],
};

export function moveField(state: SchemaState, field: FieldId, target = fieldTarget[field]): SchemaState {
  const next = Object.fromEntries(Object.entries(state).map(([id, fields]) => [id, fields.filter((item) => item !== field)])) as SchemaState;
  next[target] = [...next[target], field];
  if (target !== 'fact' && relationshipKeys[target as keyof typeof relationshipKeys] === field) next.fact = [...next.fact, field];
  return next;
}

export function buildSuggestedSchema(): SchemaState {
  return initialSchema.source.reduce((state, field) => moveField(state, field), initialSchema);
}

export function activeRelationships(state: SchemaState) {
  return Object.entries(relationshipKeys).filter(([table, key]) => state[table as TableId].includes(key) && state.fact.includes(key));
}
