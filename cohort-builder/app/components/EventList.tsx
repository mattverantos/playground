import React from 'react';
import { useCohort } from '../contexts/CohortContext';
import { Event, Filter } from '../types/cohort';

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
  
  const renderFilterSummary = (event: Event) => {
    return (
      <div className="text-sm text-gray-600">
        {event.filters.map((filter: Filter, index: number) => (
          <div key={filter.id} className="mb-1">
            {index > 0 && <span className="font-semibold">{filter.logicalOperator} </span>}
            {filter.type === 'concept' ? (
              <span>Concept: {filter.domain} {filter.operator} {filter.value || filter.minValue}</span>
            ) : (
              <span>Date: {filter.dateType} {
                filter.dateType === 'absolute' ? 
                  `${filter.startDate} to ${filter.endDate}` : 
                  `±${filter.daysBefore || 0}/${filter.daysAfter || 0} days from reference`
              }</span>
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
          {state.events.map(event => (
            <div key={event.id} className="border rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{event.name}</h3>
                  {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
                  {renderFilterSummary(event)}
                </div>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
