import React, { useState, useEffect } from 'react';
import { useCohort } from '../contexts/CohortContext';
import { Filter, Event, ComputedColumn } from '../types/cohort';
import { v4 as uuidv4 } from 'uuid';

// Import extracted components
import EntitySelector from './event-builder/EntitySelector';
import ComputedColumnSection from './event-builder/ComputedColumnSection';
import FilterSection from './event-builder/FilterSection';

const EventBuilder: React.FC = () => {
  const { state, dispatch } = useCohort();
  
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [computedColumns, setComputedColumns] = useState<ComputedColumn[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // When currentEvent is set (from EventList), populate the form
    if (state.currentEvent) {
      setEventName(state.currentEvent.name);
      setEventDescription(state.currentEvent.description || '');
      // Handle both legacy single entity and new multiple entities format
      if (state.currentEvent.entities) {
        setSelectedEntities([...state.currentEvent.entities]);
      } else {
        setSelectedEntities([]);
      }
      setFilters([...state.currentEvent.filters]);
      // Add this line to load computed columns
      setComputedColumns(state.currentEvent.computedColumns || []);
    } else {
      // Reset form when no current event
      setEventName('');
      setEventDescription('');
      setSelectedEntities([]);
      setFilters([{
        id: uuidv4(),
        type: 'column',
        columnName: '',
        columnType: 'string',
        operator: '=',
        operands: []
      }]);
      setComputedColumns([]);
    }
  }, [state.currentEvent]);

  const saveEvent = () => {
    if (!eventName.trim()) {
      alert('Please provide an event name');
      return;
    }

    if (filters.length === 0) {
      alert('Please add at least one filter');
      return;
    }

    if (selectedEntities.length === 0) {
      alert('Please select at least one entity');
      return;
    }

    // Validate computed columns
    for (const col of computedColumns) {
      if (!col.name.trim()) {
        alert('All computed columns must have a name');
        return;
      }
      if (col.operands.length < 2) {
        alert(`Column "${col.name}" needs at least two operands`);
        return;
      }
    }

    const event: Event = {
      id: state.currentEvent?.id || uuidv4(),
      name: eventName.trim(),
      description: eventDescription.trim(),
      entities: selectedEntities,
      filters,
      computedColumns,
      sql: `-- SQL would be generated based on filters`
    };

    if (state.currentEvent) {
      dispatch({ type: 'UPDATE_EVENT', payload: event });
    } else {
      dispatch({ type: 'ADD_EVENT', payload: event });
    }

    // Reset form
    setEventName('');
    setEventDescription('');
    setSelectedEntities([]);
    setFilters([{
      id: uuidv4(),
      type: 'column',
      columnName: '',
      columnType: 'string',
      operator: '=',
      operands: []
    }]);
    setComputedColumns([]);
  };

  const cancelEdit = () => {
    dispatch({ type: 'SET_CURRENT_EVENT', payload: null });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Event Builder</h2>
        <button 
          onClick={toggleMinimize}
          className="p-1 text-gray-600 hover:text-gray-900"
        >
          {isMinimized ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg> :
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          }
        </button>
      </div>
      
      {!isMinimized && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={2}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </div>
          
          {/* Entity Selector Component */}
          <EntitySelector 
            selectedEntities={selectedEntities}
            setSelectedEntities={setSelectedEntities}
            events={state.events}
            currentEventId={state.currentEvent?.id}
          />
          
          {/* Computed Columns Component */}
          <ComputedColumnSection 
            computedColumns={computedColumns}
            setComputedColumns={setComputedColumns}
            selectedEntities={selectedEntities}
            events={state.events}
          />
          
          {/* Filters Component */}
          <FilterSection 
            filters={filters}
            setFilters={setFilters}
            events={state.events}
            eventId={state.currentEvent ? state.currentEvent.id : ''}
          />
          
          <div className="flex justify-end gap-2">
            {state.currentEvent && (
              <button onClick={cancelEdit} className="px-4 py-2 border rounded">
                Cancel
              </button>
            )}
            <button 
              onClick={saveEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {state.currentEvent ? 'Update Event' : 'Save Event'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventBuilder;
