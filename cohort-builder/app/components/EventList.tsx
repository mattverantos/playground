import React from 'react';
import { useCohort } from '../contexts/CohortContext';
import { ColumnFilter, Event, Filter, OccurrenceFilter } from '../types/cohort';

const EventList: React.FC = () => {
  const { state, dispatch } = useCohort();
  
  const editEvent = (event: Event) => {
    dispatch({ type: 'SET_CURRENT_EVENT', payload: event });
  };
  
  const deleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: id });
    }
  };

  const eventMap = state.events.reduce((acc: Record<string, Event>, event) => {
    acc[event.id] = event;
    return acc;
  }, {});
  
  // Add function to determine event's criteria state
  const getEventState = (eventId: string) => {
    if (state.inclusionCriteria.includes(eventId)) return 'inclusion';
    if (state.exclusionCriteria.includes(eventId)) return 'exclusion';
    return 'none';
  };
  
  const renderFilterSummary = (event: Event) => {
    // Helper function to get ordinal suffix
    const getOrdinalSuffix = (num: number): string => {
      const j = num % 10;
      const k = num % 100;
      if (j === 1 && k !== 11) return "st";
      if (j === 2 && k !== 12) return "nd";
      if (j === 3 && k !== 13) return "rd";
      return "th";
    };
    
    return (
      <div className="text-sm text-gray-600">
        {/* Display entity first */}
        <div className="font-medium mb-1">Entity: {event.entity}</div>
        
        {event.filters.map((filter: Filter, index: number) => (
          <div key={filter.id} className="mb-1">
            {index > 0 && <span className="font-semibold">{filter.logicalOperator} </span>}
            
            {filter.type === 'column' ? (
              <span>
                {(filter as ColumnFilter).columnName || 'Column'}{' '}
                {(filter as ColumnFilter).operator && ` ${(filter as ColumnFilter).operator}`}{' '}
                {(filter as ColumnFilter).isNumeric 
                  ? `${(filter as ColumnFilter).minValue || (filter as ColumnFilter).value || ''}${(filter as ColumnFilter).maxValue ? ' to ' + (filter as ColumnFilter).maxValue : ''}`
                  : (filter as ColumnFilter).value || ''
                }
              </span>
            ) : (
              <span>
                Occurrence: {(filter as OccurrenceFilter).occurrenceType === 'index' 
                  ? `${(filter as OccurrenceFilter).index === 'last' 
                      ? 'Last' 
                      : `${(filter as OccurrenceFilter).index}${getOrdinalSuffix(Number((filter as OccurrenceFilter).index))}`
                    } occurrence` 
                  : `${(filter as OccurrenceFilter).windowType || 'rolling'} window of ${(filter as OccurrenceFilter).windowDays || 0} days`
                }
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Defined Events</h2>
      
      {state.events.length === 0 ? (
        <p className="text-gray-500">No events defined yet.</p>
      ) : (
        <div className="space-y-3">
          {state.events.map(event => {
            const eventState = getEventState(event.id);
            
            return (
              <div key={event.id} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.name}</h3>
                    {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
                    {renderFilterSummary(event)}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => editEvent(event)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    
                    {/* Add criteria toggle buttons */}
                    <div className="inline-flex shadow-sm rounded-md" role="group">
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'REMOVE_INCLUSION_CRITERIA', payload: event.id });
                          dispatch({ type: 'REMOVE_EXCLUSION_CRITERIA', payload: event.id });
                        }}
                        className={`px-2 py-1 text-xs font-medium rounded-l-lg
                          ${eventState === 'none'
                            ? 'bg-gray-200 text-gray-800 border border-gray-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        Not Used
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'REMOVE_EXCLUSION_CRITERIA', payload: event.id });
                          dispatch({ type: 'ADD_INCLUSION_CRITERIA', payload: event.id });
                        }}
                        className={`px-2 py-1 text-xs font-medium
                          ${eventState === 'inclusion'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        Include
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'REMOVE_INCLUSION_CRITERIA', payload: event.id });
                          dispatch({ type: 'ADD_EXCLUSION_CRITERIA', payload: event.id });
                        }}
                        className={`px-2 py-1 text-xs font-medium rounded-r-lg
                          ${eventState === 'exclusion'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        Exclude
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
