import React from 'react';
import { useCohort } from '../contexts/CohortContext';

interface CriteriaSelectorProps {
  type: 'inclusion' | 'exclusion';
}

const CriteriaSelector: React.FC<CriteriaSelectorProps> = ({ type }) => {
  const { state, dispatch } = useCohort();
  
  const isInCriteria = (eventId: string) => {
    return type === 'inclusion' 
      ? state.inclusionCriteria.includes(eventId)
      : state.exclusionCriteria.includes(eventId);
  };
  
  const toggleCriteria = (eventId: string) => {
    if (isInCriteria(eventId)) {
      dispatch({ 
        type: type === 'inclusion' ? 'REMOVE_INCLUSION_CRITERIA' : 'REMOVE_EXCLUSION_CRITERIA',
        payload: eventId 
      });
    } else {
      dispatch({ 
        type: type === 'inclusion' ? 'ADD_INCLUSION_CRITERIA' : 'ADD_EXCLUSION_CRITERIA',
        payload: eventId 
      });
    }
  };
  
  const title = type === 'inclusion' ? 'Inclusion Criteria' : 'Exclusion Criteria';
  const description = type === 'inclusion'
    ? 'Select events that must be present for patients to be included in the cohort.'
    : 'Select events that must NOT be present for patients to be included in the cohort.';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      {state.events.length === 0 ? (
        <div className="text-gray-500 py-4 text-center">
          No events available. Create events first.
        </div>
      ) : (
        <div className="space-y-2">
          {state.events.map(event => (
            <div key={event.id} className="flex items-center p-2 border rounded hover:bg-gray-50">
              <input
                type="checkbox"
                id={`${type}-${event.id}`}
                checked={isInCriteria(event.id)}
                onChange={() => toggleCriteria(event.id)}
                className="mr-3 h-5 w-5 text-blue-600"
              />
              <label htmlFor={`${type}-${event.id}`} className="flex-grow cursor-pointer">
                <div className="font-medium">{event.name}</div>
                {event.description && (
                  <div className="text-sm text-gray-600">{event.description}</div>
                )}
              </label>
            </div>
          ))}
        </div>
      )}
      
      {(type === 'inclusion' ? state.inclusionCriteria : state.exclusionCriteria).length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="font-medium mb-1">Selected {title}:</div>
          <ul className="list-disc pl-5">
            {state.events
              .filter(event => isInCriteria(event.id))
              .map(event => (
                <li key={event.id}>{event.name}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CriteriaSelector;
