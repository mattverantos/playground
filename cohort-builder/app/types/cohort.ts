export type FilterType = 'column' | 'occurrence';

export type FilterOperator = 'AND' | 'OR' | 'NOT';

export type ColumnType = 'date' | 'string' | 'number';

export type ColumnFunction = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE' | 'CONCAT';

export type ColumnOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'NOT IN' | 'BETWEEN';

export enum EntityColumn {
  VISIT_START_DATE = 'visit_start_date',
  VISIT_END_DATE = 'visit_end_date',
  VISIT_TYPE = 'visit_type',
  PROCEDURE_DATE = 'procedure_date',
  PROCEDURE_TYPE = 'procedure_type',
  PROCEDURE = 'procedure',
  PROCEDURE_QUANTITY = 'procedure_quantity',
  PROCEDURE_MODIFIER = 'procedure_modifier',
  OBSERVATION_DATE = 'observation_date',
  OBSERVATION_VALUE = 'observation_value',
  OBSERVATION_UNIT = 'observation_unit',
  OBSERVATION_TYPE = 'observation_type',
  MEASUREMENT_DATE = 'measurement_date',
  MEASUREMENT_VALUE = 'measurement_value',
  MEASUREMENT_TYPE = 'measurement_type',
  MEASUREMENT_SOURCE = 'measurement_source',
  MEASUREMENT_RANGE_HIGH = 'measurement_range_high',
  MEASUREMENT_RANGE_LOW = 'measurement_range_low',
  MEASUREMENT_UNIT = 'measurement_unit',
  DRUG_START_DATE = 'drug_start_date',
  DRUG_END_DATE = 'drug_end_date',
  DRUG_CONCEPT = 'drug_concept',
  DRUG_ROUTE = 'drug_route',
  DRUG_DOSE = 'drug_dose',
  DRUG_TYPE = 'drug_type',
  CONDITION_START_DATE = 'condition_start_date',
  CONDITION_END_DATE = 'condition_end_date',
  CONDITION_STATUS = 'condition_status',
  CONDITION = 'condition',
  CONDITION_SOURCE = 'condition_source',
  CONDITION_TYPE = 'condition_type',
  BIRTH_DATE = 'birth_date',
  GENDER = 'gender',
  RACE = 'race',
  ETHNICITY = 'ethnicity'
}

export enum Entity {
  CONDITION = 'condition',
  DRUG = 'drug',
  MEASUREMENT = 'measurement',
  PROCEDURE = 'procedure',
  VISIT = 'visit',
  DEMOGRAPHIC = 'demographic',
  OBSERVATION = 'observation',
}

export type EventId = string;
export type EventColumnId = string;
export type ComputedColumnId = string;

export type EventColumn = {
  id: EventColumnId;
  eventId: EventId;
  column: EntityColumn;
}

export type ComputedColumn = {
  id: ComputedColumnId;
  name: string;
  function: ColumnFunction;
  operands: Operand[];
}

export interface BaseFilter {
  id: string;
  type: FilterType;
  logicalOperator?: FilterOperator;
}

export type Operand = string | number | EventColumnId | ComputedColumnId | EntityColumn;

// New filter type for column filtering
export interface ColumnFilter extends BaseFilter {
  type: 'column';
  columnType: ColumnType;
  columnName?: EntityColumn | ComputedColumn; // concept, concept type, related concept, etc.
  operator?: ColumnOperator;
  operands?: [] | [Operand] | [Operand, Operand];
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
  entities: Entity[]; // Changed from string[] to Entity[]
  computedColumns: ComputedColumn[];
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
