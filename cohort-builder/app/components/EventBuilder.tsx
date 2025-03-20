import React, { useState, useEffect } from 'react';
import { useCohort } from '../contexts/CohortContext';
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

const columnOptions = [
  { value: 'concept', label: 'Concept', type: 'string' },
  { value: 'concept_type', label: 'Concept Type', type: 'string' },
  { value: 'related_concept', label: 'Related Concept', type: 'string' },
  { value: 'related_concept_type', label: 'Related Concept Type', type: 'string' },
  { value: 'value', label: 'Value', type: 'numeric' },
  { value: 'related_value', label: 'Related Value', type: 'numeric' },
  { value: 'occurrence_date', label: 'Occurrence Date', type: 'date' }
];

// Component for Column Filters
const ColumnFilterComponent: React.FC<{
  filter: ColumnFilter;
  updateFilter: (id: string, field: string, value: any) => void;
}> = ({ filter, updateFilter }) => {
  const selectedColumn = columnOptions.find(col => col.value === filter.columnName);
  const isNumeric = selectedColumn?.type === 'numeric';
  const isDate = selectedColumn?.type === 'date';

  const handleUpdate = (field: string, value: any) => {
    updateFilter(filter.id, field, value);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Column</label>
            <select
              className="w-full p-2 border rounded"
              value={filter.columnName || columnOptions[0].value}
              onChange={(e) => handleUpdate('columnName', e.target.value)}
            >
              {columnOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Operator</label>
            <select
              className="w-full p-2 border rounded"
              value={filter.operator || 'equals'}
              onChange={(e) => handleUpdate('operator', e.target.value)}
            >
              {isNumeric ? (
                <>
                  <option value="equals">= (equals)</option>
                  <option value="not_equals">!= (not equals)</option>
                  <option value="greater_than">&gt; (greater than)</option>
                  <option value="less_than">&lt; (less than)</option>
                  <option value="greater_equals">&gt;= (greater equals)</option>
                  <option value="less_equals">&lt;= (less equals)</option>
                  <option value="between">BETWEEN</option>
                </>
              ) : isDate ? (
                <>
                  <option value="equals">= (equals)</option>
                  <option value="not_equals">!= (not equals)</option>
                  <option value="greater_than">&gt; (after)</option>
                  <option value="less_than">&lt; (before)</option>
                  <option value="between">BETWEEN</option>
                </>
              ) : (
                <>
                  <option value="equals">= (equals)</option>
                  <option value="not_equals">!= (not equals)</option>
                  <option value="contains">CONTAINS</option>
                  <option value="starts_with">STARTS WITH</option>
                  <option value="ends_with">ENDS WITH</option>
                  <option value="in">IN</option>
                  <option value="not_in">NOT IN</option>
                </>
              )}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filter.operator === 'between' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Min Value</label>
                <input
                  type={isDate ? "date" : isNumeric ? "number" : "text"}
                  className="w-full p-2 border rounded"
                  value={filter.minValue || ''}
                  onChange={(e) => handleUpdate('minValue', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Value</label>
                <input
                  type={isDate ? "date" : isNumeric ? "number" : "text"}
                  className="w-full p-2 border rounded"
                  value={filter.maxValue || ''}
                  onChange={(e) => handleUpdate('maxValue', e.target.value)}
                />
              </div>
            </>
          ) : filter.operator === 'in' || filter.operator === 'not_in' ? (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Values (comma separated)</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={filter.value || ''}
                placeholder="value1, value2, value3"
                onChange={(e) => handleUpdate('value', e.target.value)}
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type={isDate ? "date" : isNumeric ? "number" : "text"}
                className="w-full p-2 border rounded"
                value={filter.value || ''}
                onChange={(e) => handleUpdate('value', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Component for Occurrence Filters
const OccurrenceFilterComponent: React.FC<{
  filter: OccurrenceFilter;
  updateFilter: (id: string, field: string, value: any) => void;
}> = ({ filter, updateFilter }) => {
  const handleUpdate = (field: string, value: any) => {
    updateFilter(filter.id, field, value);
  };

  return (
    <div className="p-3 border rounded bg-gray-50">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Occurrence Type</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={filter.occurrenceType === 'index'}
              onChange={() => handleUpdate('occurrenceType', 'index')}
              className="mr-2"
            />
            Index
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={filter.occurrenceType === 'window'}
              onChange={() => handleUpdate('occurrenceType', 'window')}
              className="mr-2"
            />
            Window
          </label>
        </div>
      </div>
      
      {filter.occurrenceType === 'index' ? (
        <div>
          <label className="block text-sm font-medium mb-1">Select Index</label>
          <select
            className="w-full p-2 border rounded"
            value={filter.index === 'last' ? 'last' : filter.index?.toString() || '1'}
            onChange={(e) => {
              const value = e.target.value === 'last' ? 'last' : parseInt(e.target.value);
              handleUpdate('index', value);
            }}
          >
            <option value="1">1st occurrence</option>
            <option value="2">2nd occurrence</option>
            <option value="3">3rd occurrence</option>
            <option value="4">4th occurrence</option>
            <option value="5">5th occurrence</option>
            <option value="last">Last occurrence</option>
          </select>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Window Type</label>
            <select
              className="w-full p-2 border rounded"
              value={filter.windowType || 'fixed'}
              onChange={(e) => handleUpdate('windowType', e.target.value)}
            >
              <option value="fixed">Fixed Window</option>
              <option value="rolling">Rolling Window</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Window Length (days)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={filter.windowDays || ''}
              onChange={(e) => handleUpdate('windowDays', parseInt(e.target.value) || undefined)}
              min="1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Wrapper Component
const FilterWrapper: React.FC<{
  filter: Filter;
  index: number;
  updateFilter: (id: string, field: string, value: any) => void;
  removeFilter: (id: string) => void;
  showLogicalOperator: boolean;
  events: Event[];
}> = ({ filter, index, updateFilter, removeFilter, showLogicalOperator, events }) => {
  return (
    <div key={filter.id} className="p-3 border rounded mb-2 bg-gray-50">
      <div className="flex justify-between mb-2">
        <span className="font-medium">
          {filter.type === 'column' ? 'Column Filter' :
           'Occurrence Filter'} {index + 1}
        </span>
        <button 
          onClick={() => removeFilter(filter.id)}
          className="text-red-500"
        >
          Remove
        </button>
      </div>
      
      {showLogicalOperator && (
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Logical Operator</label>
          <select
            className="w-full p-2 border rounded"
            value={filter.logicalOperator || 'AND'}
            onChange={(e) => updateFilter(filter.id, 'logicalOperator', e.target.value)}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
      )}
      
      {filter.type === 'column' && (
        <ColumnFilterComponent 
          filter={filter as ColumnFilter} 
          updateFilter={updateFilter}
        />
      )}
      
      {filter.type === 'occurrence' && (
        <OccurrenceFilterComponent 
          filter={filter as OccurrenceFilter} 
          updateFilter={updateFilter}
        />
      )}
    </div>
  );
};

const EventBuilder: React.FC = () => {
  const { state, dispatch } = useCohort();
  
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventEntity, setEventEntity] = useState(domainOptions[0].value);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterToAdd, setFilterToAdd] = useState<FilterType>('column');
  const [isMinimized, setIsMinimized] = useState(false);

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
            <label className="block text-sm font-medium mb-1">Entity (Table)</label>
            <select
              className="w-full p-2 border rounded"
              value={eventEntity}
              onChange={(e) => setEventEntity(e.target.value)}
            >
              {domainOptions.map(option => (
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
