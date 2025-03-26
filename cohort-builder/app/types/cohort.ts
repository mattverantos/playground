export type FilterType = 'column' | 'occurrence';

export type FilterOperator = 'AND' | 'OR' | 'NOT';

export type ColumnType = 'date' | 'string' | 'number';

export type ColumnOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'NOT IN' | 'BETWEEN';

export type EntityColumn = {
  id: string;
  column: string;
}

export interface BaseFilter {
  id: string;
  type: FilterType;
  logicalOperator?: FilterOperator;
}

type Operand = string | number | EntityColumn;

// New filter type for column filtering
export interface ColumnFilter extends BaseFilter {
  type: 'column';
  columnType: ColumnType;
  columnName?: string; // concept, concept type, related concept, etc.
  operator?: ColumnOperator;
  operands?: [Operand] | [Operand, Operand];
}

// New filter type for frequency filtering
// export interface OccurrenceFilter extends BaseFilter {
//   type: 'occurrence';
//   occurrenceType: 'index' | 'window';
//   index?: number | 'last'; // For index type: 1st (1), 2nd (2), etc., or 'last'
//   windowType?: 'rolling' | 'fixed'; // For window type
//   windowDays?: number; // Number of days for the window
// }

export type Filter = ColumnFilter;

export interface Event {
  id: string;
  name: string;
  description: string;
  entities: string[];
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
