import { CohortAction, CohortState, Event, Filter } from '../types/cohort';
import { v4 as uuidv4 } from 'uuid';

export const initialState: CohortState = {
  "events": [
    {
      "id": "1",
      "name": "Oral DMT Prescription",
      "description": "Prescription of oral disease-modifying therapy (index event)",
      "entities": [
        "drug"
      ],
      "filters": [
        {
          "id": "1a",
          "type": "column",
          "logicalOperator": null,
          "columnName": "drug_type",
          "operator": "=",
          "value": "oral disease-modifying therapy",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        },
        {
          "id": "1b",
          "type": "column",
          "logicalOperator": null,
          "columnName": "route",
          "operator": "=",
          "value": "oral",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        }
      ]
    },
    {
      "id": "2",
      "name": "Age Check",
      "description": "Patient age at least 18 years on index date",
      "entities": [
        "demographic"
      ],
      "filters": [
        {
          "id": "2a",
          "type": "column",
          "logicalOperator": null,
          "columnName": "measurement",
          "operator": ">=",
          "value": 18.0,
          "minValue": null,
          "maxValue": null,
          "isNumeric": true,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        }
      ]
    },
    {
      "id": "3",
      "name": "RRMS Diagnosis",
      "description": "RRMS diagnosis by neurologist during 6-month baseline",
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "3a",
          "type": "column",
          "logicalOperator": null,
          "columnName": "condition",
          "operator": "=",
          "value": "RRMS",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        },
        {
          "id": "3b",
          "type": "occurrence",
          "logicalOperator": null,
          "occurrenceType": "window",
          "index": null,
          "windowType": "fixed",
          "windowDays": 180.0
        }
      ]
    },
    {
      "id": "4",
      "name": "Prior Oral DMT",
      "description": "Any use of oral DMT prior to index",
      "entities": [
        "drug"
      ],
      "filters": [
        {
          "id": "4a",
          "type": "column",
          "logicalOperator": null,
          "columnName": "drug_type",
          "operator": "=",
          "value": "oral disease-modifying therapy",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        },
        {
          "id": "4b",
          "type": "column",
          "logicalOperator": null,
          "columnName": "route",
          "operator": "=",
          "value": "oral",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        }
      ]
    },
    {
      "id": "5",
      "name": "PPMS Diagnosis",
      "description": "Two PPMS diagnoses on separate days in baseline",
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "5a",
          "type": "column",
          "logicalOperator": null,
          "columnName": "condition",
          "operator": "=",
          "value": "PPMS",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        },
        {
          "id": "5b",
          "type": "occurrence",
          "logicalOperator": null,
          "occurrenceType": "window",
          "index": null,
          "windowType": "fixed",
          "windowDays": 180.0
        }
      ]
    },
    {
      "id": "6",
      "name": "Severe Infection",
      "description": "Severe infections requiring hospitalization within 30 days prior to index",
      "entities": [
        "condition",
        "visit"
      ],
      "filters": [
        {
          "id": "6a",
          "type": "column",
          "logicalOperator": null,
          "columnName": "condition",
          "operator": "=",
          "value": "severe infection",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        },
        {
          "id": "6b",
          "type": "column",
          "logicalOperator": null,
          "columnName": "visit_type",
          "operator": "=",
          "value": "inpatient",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        },
        {
          "id": "6c",
          "type": "occurrence",
          "logicalOperator": null,
          "occurrenceType": "window",
          "index": null,
          "windowType": "fixed",
          "windowDays": 30.0
        }
      ]
    },
    {
      "id": "7",
      "name": "Malignancy History",
      "description": "History of malignancy excluding non-melanoma skin cancer",
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "7a",
          "type": "column",
          "logicalOperator": null,
          "columnName": "condition",
          "operator": "=",
          "value": "malignancy",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        },
        {
          "id": "7b",
          "type": "column",
          "logicalOperator": null,
          "columnName": "condition",
          "operator": "!=",
          "value": "non-melanoma skin cancer",
          "minValue": null,
          "maxValue": null,
          "isNumeric": null,
          "isDate": null,
          "relatedEventId": null,
          "relatedColumn": null,
          "dateComparison": null,
          "daysOffset": null
        }
      ]
    }
  ],
  "currentEvent": null,
  "indexEventId": "1",
  "inclusionCriteria": [
    "1",
    "2",
    "3"
  ],
  "exclusionCriteria": [
    "4",
    "5",
    "6",
    "7"
  ]
};

export const cohortReducer = (state: CohortState, action: CohortAction): CohortState => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, { 
          ...action.payload, 
          id: action.payload.id || uuidv4(),
          entities: action.payload.entities
        }],
        currentEvent: null
      };
    
    case 'UPDATE_EVENT': {
      // Check if event exists and convert legacy events
      const updatedEvents = state.events.map(event => 
        event.id === action.payload.id ? {
          ...action.payload,
          entities: action.payload.entities
        } : event
      );
      
      return {
        ...state,
        events: updatedEvents,
        currentEvent: null
      };
    }
    
    case 'DELETE_EVENT': {
      // If deleted event is index or in criteria, remove those references
      const newState = { ...state };
      if (state.indexEventId === action.payload) {
        newState.indexEventId = null;
      }
      newState.inclusionCriteria = newState.inclusionCriteria.filter(id => id !== action.payload);
      newState.exclusionCriteria = newState.exclusionCriteria.filter(id => id !== action.payload);
      
      return {
        ...newState,
        events: state.events.filter(event => event.id !== action.payload)
      };
    }
    
    case 'SET_CURRENT_EVENT': {
      return {
        ...state,
        currentEvent: action.payload
      };
    }
    
    case 'SET_INDEX_EVENT':
      return {
        ...state,
        indexEventId: action.payload
      };
    
    case 'ADD_INCLUSION_CRITERIA':
      if (state.inclusionCriteria.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        inclusionCriteria: [...state.inclusionCriteria, action.payload],
        // Remove from exclusion if it exists there
        exclusionCriteria: state.exclusionCriteria.filter(id => id !== action.payload)
      };
    
    case 'REMOVE_INCLUSION_CRITERIA':
      return {
        ...state,
        inclusionCriteria: state.inclusionCriteria.filter(id => id !== action.payload)
      };
    
    case 'ADD_EXCLUSION_CRITERIA':
      if (state.exclusionCriteria.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        exclusionCriteria: [...state.exclusionCriteria, action.payload],
        // Remove from inclusion if it exists there
        inclusionCriteria: state.inclusionCriteria.filter(id => id !== action.payload)
      };
    
    case 'REMOVE_EXCLUSION_CRITERIA':
      return {
        ...state,
        exclusionCriteria: state.exclusionCriteria.filter(id => id !== action.payload)
      };
    
    default:
      return state;
  }
};
