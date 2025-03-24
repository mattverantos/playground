import React, { useState, useEffect } from 'react';
import { useCohort } from '../contexts/CohortContext';
import { columnOptions } from './ColumnFilter';
import FilterWrapper from './FilterWrapper';
import { Filter, FilterType, Event, ColumnFilter, OccurrenceFilter } from '../types/cohort';
import { v4 as uuidv4 } from 'uuid';

const domainOptions = [
  { value: 'visit', label: 'Visit' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'observation', label: 'Observation' },
  { value: 'measurement', label: 'Measurement' },
  { value: 'drug', label: 'Drug' },
  { value: 'condition', label: 'Condition' }
];

const EventBuilder: React.FC = () => {
  const { state, dispatch } = useCohort();
  
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventEntity, setEventEntity] = useState(domainOptions[0].value);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterToAdd, setFilterToAdd] = useState<FilterType>('column');
  const [isMinimized, setIsMinimized] = useState(false);

  // Generate combined entity options (domain tables + existing events)
  const getEntityOptions = () => {
    // Start with standard domain options
    const options = [...domainOptions];
    
    // Add saved events as entity options
    state.events.forEach(event => {
      // Prevent current event from selecting itself or duplicate options
      if (!state.currentEvent || event.id !== state.currentEvent.id) {
        options.push({
          value: `event:${event.id}`,
          label: `Event: ${event.name}`
        });
      }
    });
    
    return options;
  };

  // Generate empty column filter template
  const newColumnFilter = (operator?: 'AND' | 'OR'): ColumnFilter => ({
    id: uuidv4(),
    type: 'column',
    logicalOperator: operator,
    columnName: columnOptions[0].value,
  });

  // Generate empty occurrence filter template
  const newOccurrenceFilter = (operator?: 'AND' | 'OR'): OccurrenceFilter => ({
    id: uuidv4(),
    type: 'occurrence',
    logicalOperator: operator,
    occurrenceType: 'index',
    index: 1,
  });

  useEffect(() => {
    // When currentEvent is set (from EventList), populate the form
    if (state.currentEvent) {
      setEventName(state.currentEvent.name);
      setEventDescription(state.currentEvent.description || '');
      setEventEntity(state.currentEvent.entity || domainOptions[0].value);
      setFilters([...state.currentEvent.filters]);
    } else {
      // Reset form when no current event
      setEventName('');
      setEventDescription('');
      setEventEntity(domainOptions[0].value);
      setFilters([newColumnFilter()]);
    }
  }, [state.currentEvent]);

  const addFilter = () => {
    const operator = filters.length > 0 ? 'AND' : undefined;
    
    switch (filterToAdd) {
      case 'column':
        setFilters([...filters, newColumnFilter(operator)]);
        break;
      case 'occurrence':
        setFilters([...filters, newOccurrenceFilter(operator)]);
        break;
      default:
        setFilters([...filters, newColumnFilter(operator)]);
    }
  };

  const removeFilter = (id: string) => {
    if (filters.length <= 1) return; // Don't remove the last filter
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const updateFilter = (id: string, field: string, value: any) => {
    setFilters(
      filters.map(filter => {
        if (filter.id === id) {
          // Special handling for column selection in column filter
          if (filter.type === 'column' && field === 'columnName') {
            const columnOption = columnOptions.find(col => col.value === value);
            return {
              ...filter,
              [field]: value,
              isNumeric: columnOption?.type === 'numeric',
              isDate: columnOption?.type === 'date'
            };
          }
          return { ...filter, [field]: value };
        }
        return filter;
      })
    );
  };

  const saveEvent = () => {
    if (!eventName.trim()) {
      alert('Please provide an event name');
      return;
    }

    if (filters.length === 0) {
      alert('Please add at least one filter');
      return;
    }

    const event: Event = {
      id: state.currentEvent?.id || uuidv4(),
      name: eventName.trim(),
      description: eventDescription.trim(),
      entity: eventEntity,
      filters,
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
    setEventEntity(domainOptions[0].value);
    setFilters([newColumnFilter()]);
  };

  const cancelEdit = () => {
    dispatch({ type: 'SET_CURRENT_EVENT', payload: null });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Get combined entity options
  const entityOptions = getEntityOptions();

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
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Entity (Table or Event)</label>
            <select
              className="w-full p-2 border rounded"
              value={eventEntity}
              onChange={(e) => setEventEntity(e.target.value)}
            >
              {entityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Filters</h3>
              <div className="flex gap-2">
                <select 
                  className="p-1 border rounded text-sm"
                  value={filterToAdd}
                  onChange={(e) => setFilterToAdd(e.target.value as FilterType)}
                >
                  <option value="column">Column Filter</option>
                  <option value="occurrence">Occurrence Filter</option>
                </select>
                <button 
                  onClick={addFilter}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Add Filter
                </button>
              </div>
            </div>
            
            {filters.map((filter, index) => (
              <FilterWrapper
                key={filter.id}
                filter={filter}
                index={index}
                updateFilter={updateFilter}
                removeFilter={removeFilter}
                showLogicalOperator={index > 0}
                events={state.events}
              />
            ))}
          </div>
          
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
