import React from 'react';
import { useCohort } from '../contexts/CohortContext';

const IndexDateSelector: React.FC = () => {
  const { state, dispatch } = useCohort();

  const handleSelectIndexEvent = (eventId: string) => {
    dispatch({ type: 'SET_INDEX_EVENT', payload: eventId });
  };

  const getEventName = (eventId: string | null) => {
    if (!eventId) return 'None';
    const event = state.events.find(e => e.id === eventId);
    return event ? event.name : 'Unknown event';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Index Date</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Select an event to use as the index date for your cohort. The index date defines the 
          starting point for patients in your cohort.
        </p>
        
        <div className="mb-2">
          <span className="font-medium">Current index date: </span>
          <span className={state.indexEventId ? "text-blue-600" : "text-gray-500"}>
            {getEventName(state.indexEventId)}
          </span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Select Event for Index Date</label>
        <select
          className="w-full p-2 border rounded"
          value={state.indexEventId || ''}
          onChange={(e) => handleSelectIndexEvent(e.target.value)}
          disabled={state.events.length === 0}
        >
          <option value="">None</option>
          {state.events.map(event => (
            <option key={event.id} value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default IndexDateSelector;
