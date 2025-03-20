import { CohortAction, CohortState, Event, Filter } from '../types/cohort';
import { v4 as uuidv4 } from 'uuid';

export const initialState: CohortState = {
  events: [],
  currentEvent: null,
  indexEventId: null,
  inclusionCriteria: [],
  exclusionCriteria: []
};


export const cohortReducer = (state: CohortState, action: CohortAction): CohortState => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, { ...action.payload, id: action.payload.id || uuidv4() }],
        currentEvent: null
      };
    
    case 'UPDATE_EVENT': {
      // Check if event exists and convert legacy events
      const updatedEvents = state.events.map(event => 
        event.id === action.payload.id ? action.payload : event
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
