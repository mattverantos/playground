import { Entity } from '../types/cohort';

export const domainOptions = [
  { value: 'visit', label: 'Visit' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'measurement', label: 'Measurement' },
  { value: 'drug', label: 'Drug' },
  { value: 'condition', label: 'Condition' },
  { value: 'demographic', label: 'Demographic' },
];

export const functionOptions = [
  { value: 'ADD', label: 'Add (+)' },
  { value: 'SUBTRACT', label: 'Subtract (-)' },
  { value: 'MULTIPLY', label: 'Multiply (×)' },
  { value: 'DIVIDE', label: 'Divide (÷)' },
  { value: 'CONCAT', label: 'Concatenate' },
];

// Sample column options for entities - in a real app, these would come from your schema
export const entityColumnOptions: Record<Entity, string[]> = {
  'visit': ['visit_start_date', 'visit_end_date', 'visit_type'],
  'procedure': ['procedure_date', 'procedure_type', 'procedure', 'procedure_quantity', 'procedure_modifier'],
  'observation': ['observation_date', 'observation_value', 'observation_unit', 'observation_type'],
  'measurement': ['measurement_date', 'measurement_value', 'measurement_unit'],
  'drug': ['drug_start_date', 'drug_end_date', 'drug_concept'],
  'condition': ['condition_start_date', 'condition_end_date', 'condition_status', 'condition', 'condition_source', 'condition_type'],
  'demographic': ['birth_date', 'gender', 'race', 'ethnicity'],
};
