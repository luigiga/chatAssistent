export interface MemoryFilters {
  categories?: string[];
  types?: ('task' | 'note' | 'reminder')[];
  hasObservations?: boolean;
  sortBy?: 'recent' | 'oldest';
}

