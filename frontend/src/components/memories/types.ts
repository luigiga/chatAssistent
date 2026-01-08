export interface MemoryFilters {
  categories?: string[]; // categoryIds
  types?: ('task' | 'note' | 'reminder')[];
  hasObservations?: boolean;
  sortBy?: 'recent' | 'oldest';
}

