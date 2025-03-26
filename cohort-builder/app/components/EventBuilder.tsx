import React, { useState, useEffect, useRef } from 'react';
import { useCohort } from '../contexts/CohortContext';
import { columnOptions } from './ColumnFilter';
import FilterWrapper from './FilterWrapper';
import { Filter, FilterType, Event, ColumnFilter, FilterOperator } from '../types/cohort';
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
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate combined entity options (domain tables + existing events)
  const getEntityOptions = () => {
    // Start with standard domain options
    const options = [...domainOptions];
    
    // Add saved events as entity options
    state.events.forEach(event => {
      // Prevent current event from selecting itself or duplicate options
      if (!state.currentEvent || event.id !== state.currentEvent.id) {
        options.push({
          value: event.id,
          label: `Event: ${event.name}`
        });
      }
    });
    
    return options;
  };

  // Generate empty column filter template
  const newColumnFilter = (operator?: FilterOperator): ColumnFilter => ({
    id: uuidv4(),
    type: 'column',
    logicalOperator: operator,
    columnName: columnOptions[0].value,
    columnType: 'string',
    operator: '=',
    operands: []
  });

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
    } else {
      // Reset form when no current event
      setEventName('');
      setEventDescription('');
      setSelectedEntities([]);
      setFilters([newColumnFilter()]);
    }
  }, [state.currentEvent]);

  const addFilter = () => {
    const operator = filters.length > 0 ? 'AND' : undefined;
    setFilters([...filters, newColumnFilter(operator)]);
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
              columnType: columnOption?.type === 'numeric' ? 'number' : 
                         columnOption?.type === 'date' ? 'date' : 'string'
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

    if (selectedEntities.length === 0) {
      alert('Please select at least one entity');
      return;
    }

    const event: Event = {
      id: state.currentEvent?.id || uuidv4(),
      name: eventName.trim(),
      description: eventDescription.trim(),
      entities: selectedEntities,
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
    setSelectedEntities([]);
    setFilters([newColumnFilter()]);
  };

  const handleEntityToggle = (entityValue: string) => {
    if (selectedEntities.includes(entityValue)) {
      // Remove entity if already selected
      setSelectedEntities(selectedEntities.filter(e => e !== entityValue));
    } else {
      // Add entity if not already selected
      setSelectedEntities([...selectedEntities, entityValue]);
    }
  };

  const removeEntity = (entityValue: string) => {
    setSelectedEntities(selectedEntities.filter(e => e !== entityValue));
  };

  const cancelEdit = () => {
    dispatch({ type: 'SET_CURRENT_EVENT', payload: null });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Add effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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
            <label className="block text-sm font-medium mb-2">Entities (Tables or Events)</label>
            
            {/* Entity selection tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedEntities.map(entity => {
                const option = entityOptions.find(opt => opt.value === entity);
                return (
                  <div key={entity} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <span>{option?.label || entity}</span>
                    <button 
                      onClick={() => removeEntity(entity)}
                      className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
            
            {/* Entity dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between p-2 border rounded bg-white focus:ring-2 focus:ring-blue-300"
              >
                <span>Select entities...</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {entityOptions.map(option => (
                    <div 
                      key={option.value}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedEntities.includes(option.value) ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        handleEntityToggle(option.value);
                        // Don't close dropdown to allow multiple selections
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEntities.includes(option.value)}
                          onChange={() => {}} // Handle changes through the parent div's onClick
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="ml-2">{option.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mt-1">
              Click items to select multiple entities (treated as OR condition)
            </p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Filters</h3>
              <div className="flex gap-2">
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
