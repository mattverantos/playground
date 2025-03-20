export type FilterType = 'concept' | 'date';

export interface BaseFilter {
  id: string;
  type: FilterType;
  logicalOperator?: 'AND' | 'OR';
}

export interface ConceptFilter extends BaseFilter {
  type: 'concept';
  domain: string;
  column?: string;
  operator?: string;
  value?: string;
  minValue?: string;
  maxValue?: string;
}

export interface DateFilter extends BaseFilter {
  type: 'date';
  dateType: 'absolute' | 'relative';
  startDate?: string;
  endDate?: string;
  referencedEventId?: string;
  daysBefore?: number;
  daysAfter?: number;
}

export type Filter = ConceptFilter | DateFilter;

export interface Event {
  id: string;
  name: string;
  description: string;
  filters: Filter[];
  sql: string;
}

export interface CohortState {
  events: Event[];
  currentEvent: Event | null;
  indexEventId: string | null;
  inclusionCriteria: string[];
  exclusionCriteria: string[];
}

export type CohortAction =
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_CURRENT_EVENT'; payload: Event | null }
  | { type: 'SET_INDEX_EVENT'; payload: string | null }
  | { type: 'ADD_INCLUSION_CRITERIA'; payload: string }
  | { type: 'REMOVE_INCLUSION_CRITERIA'; payload: string }
  | { type: 'ADD_EXCLUSION_CRITERIA'; payload: string }
  | { type: 'REMOVE_EXCLUSION_CRITERIA'; payload: string };
