import { Entity, EntityColumn } from '../types/cohort';

export const domainOptions = [
  { value: Entity.VISIT, label: 'Visit' },
  { value: Entity.PROCEDURE, label: 'Procedure' },
  { value: Entity.MEASUREMENT, label: 'Measurement' },
  { value: Entity.DRUG, label: 'Drug' },
  { value: Entity.CONDITION, label: 'Condition' },
  { value: Entity.DEMOGRAPHIC, label: 'Demographic' },
];

export const functionOptions = [
  { value: 'ADD', label: 'Add (+)' },
  { value: 'SUBTRACT', label: 'Subtract (-)' },
  { value: 'MULTIPLY', label: 'Multiply (×)' },
  { value: 'DIVIDE', label: 'Divide (÷)' },
  { value: 'CONCAT', label: 'Concatenate' },
];

// Sample column options for entities - in a real app, these would come from your schema
export const entityColumnOptions: Record<Entity, EntityColumn[]> = {
  [Entity.VISIT]: [
    EntityColumn.VISIT_START_DATE,
    EntityColumn.VISIT_END_DATE,
    EntityColumn.VISIT_TYPE
  ],
  [Entity.PROCEDURE]: [
    EntityColumn.PROCEDURE_DATE,
    EntityColumn.PROCEDURE_TYPE,
    EntityColumn.PROCEDURE,
    EntityColumn.PROCEDURE_QUANTITY,
    EntityColumn.PROCEDURE_MODIFIER
  ],
  [Entity.OBSERVATION]: [
    EntityColumn.OBSERVATION_DATE,
    EntityColumn.OBSERVATION_VALUE,
    EntityColumn.OBSERVATION_UNIT,
    EntityColumn.OBSERVATION_TYPE
  ],
  [Entity.MEASUREMENT]: [
    EntityColumn.MEASUREMENT_DATE,
    EntityColumn.MEASUREMENT_VALUE,
    EntityColumn.MEASUREMENT_UNIT
  ],
  [Entity.DRUG]: [
    EntityColumn.DRUG_START_DATE,
    EntityColumn.DRUG_END_DATE,
    EntityColumn.DRUG_CONCEPT
  ],
  [Entity.CONDITION]: [
    EntityColumn.CONDITION_START_DATE,
    EntityColumn.CONDITION_END_DATE,
    EntityColumn.CONDITION_STATUS,
    EntityColumn.CONDITION,
    EntityColumn.CONDITION_SOURCE,
    EntityColumn.CONDITION_TYPE
  ],
  [Entity.DEMOGRAPHIC]: [
    EntityColumn.BIRTH_DATE,
    EntityColumn.GENDER,
    EntityColumn.RACE,
    EntityColumn.ETHNICITY
  ],
};
