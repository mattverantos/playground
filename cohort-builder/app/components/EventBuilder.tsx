import React, { useState, useEffect } from 'react';
import { useCohort } from '../contexts/CohortContext';
import { Filter, ConceptFilter, DateFilter, FilterType, Event } from '../types/cohort';
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
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterToAdd, setFilterToAdd] = useState<FilterType>('concept');
  
  // Generate empty concept filter template
  const newConceptFilter = (operator?: 'AND' | 'OR'): ConceptFilter => ({
    id: uuidv4(),
    type: 'concept',
    logicalOperator: operator,
    domain: 'condition',
  });

  // Generate empty date filter template
  const newDateFilter = (operator?: 'AND' | 'OR'): DateFilter => ({
    id: uuidv4(),
    type: 'date',
    logicalOperator: operator,
    dateType: 'absolute',
  });

  useEffect(() => {
    // When currentEvent is set (from EventList), populate the form
    if (state.currentEvent) {
      setEventName(state.currentEvent.name);
      setEventDescription(state.currentEvent.description || '');
      setFilters([...state.currentEvent.filters]);
    } else {
      // Reset form when no current event
      setEventName('');
      setEventDescription('');
      setFilters([newConceptFilter()]);
    }
  }, [state.currentEvent]);

  const addFilter = () => {
    const operator = filters.length > 0 ? 'AND' : undefined;
    
    if (filterToAdd === 'concept') {
      setFilters([...filters, newConceptFilter(operator)]);
    } else {
      setFilters([...filters, newDateFilter(operator)]);
    }
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const updateFilter = (id: string, field: string, value: any) => {
    setFilters(
      filters.map(filter => 
        filter.id === id ? { ...filter, [field]: value } : filter
      )
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
      filters,
      // In a real app, we would generate SQL here
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
    setFilters([newConceptFilter()]);
  };

  const cancelEdit = () => {
    dispatch({ type: 'SET_CURRENT_EVENT', payload: null });
  };

  const renderFilterContent = (filter: Filter, index: number) => {
    if (filter.type === 'concept') {
      return renderConceptFilter(filter as ConceptFilter, index);
    } else {
      return renderDateFilter(filter as DateFilter);
    }
  };

  const renderConceptFilter = (filter: ConceptFilter, index: number) => {
    return (
      <div className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Table</label>
            <select
              className="w-full p-2 border rounded"
              value={filter.domain}
              onChange={(e) => updateFilter(filter.id, 'domain', e.target.value)}
            >
              {domainOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Column</label>
            <select
              className="w-full p-2 border rounded"
              value={filter.column || 'concept_name'}
              onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
            >
              <option value="concept_name">Concept Name</option>
              <option value="concept_id">Concept ID</option>
              <option value="value_as_number">Value as Number</option>
              <option value="value_as_concept">Value as Concept</option>
              <option value="start_date">Start Date</option>
              <option value="end_date">End Date</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Operator</label>
            <select
              className="w-full p-2 border rounded"
              value={filter.operator || 'equals'}
              onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
            >
              <option value="equals">= (equals)</option>
              <option value="not_equals">!= (not equals)</option>
              <option value="contains">CONTAINS</option>
              <option value="greater_than">&gt; (greater than)</option>
              <option value="less_than">&lt; (less than)</option>
              <option value="greater_equals">&gt;= (greater equals)</option>
              <option value="less_equals">&lt;= (less equals)</option>
              <option value="between">BETWEEN</option>
              <option value="in">IN</option>
              <option value="not_in">NOT IN</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filter.operator === 'between' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Min Value</label>
                <input
                  type={filter.column?.includes('date') ? "date" : "text"}
                  className="w-full p-2 border rounded"
                  value={filter.minValue || ''}
                  onChange={(e) => updateFilter(filter.id, 'minValue', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Value</label>
                <input
                  type={filter.column?.includes('date') ? "date" : "text"}
                  className="w-full p-2 border rounded"
                  value={filter.maxValue || ''}
                  onChange={(e) => updateFilter(filter.id, 'maxValue', e.target.value)}
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
                onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type={filter.column?.includes('date') ? "date" : 
                     filter.column?.includes('number') ? "number" : "text"}
                className="w-full p-2 border rounded"
                value={filter.value || ''}
                onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDateFilter = (filter: DateFilter) => {
    return (
      <div className="p-3 border rounded bg-gray-50">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Date Filter Type</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={filter.dateType === 'absolute'}
                onChange={() => updateFilter(filter.id, 'dateType', 'absolute')}
                className="mr-2"
              />
              Absolute Date
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={filter.dateType === 'relative'}
                onChange={() => updateFilter(filter.id, 'dateType', 'relative')}
                className="mr-2"
              />
              Relative to Event
            </label>
          </div>
        </div>
        
        {filter.dateType === 'absolute' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={filter.startDate || ''}
                onChange={(e) => updateFilter(filter.id, 'startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={filter.endDate || ''}
                onChange={(e) => updateFilter(filter.id, 'endDate', e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Reference Event</label>
              <select
                className="w-full p-2 border rounded"
                value={filter.referencedEventId || ''}
                onChange={(e) => updateFilter(filter.id, 'referencedEventId', e.target.value)}
              >
                <option value="">Select Event</option>
                {state.events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Days Before</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={filter.daysBefore || ''}
                onChange={(e) => updateFilter(filter.id, 'daysBefore', parseInt(e.target.value) || undefined)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Days After</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={filter.daysAfter || ''}
                onChange={(e) => updateFilter(filter.id, 'daysAfter', parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Event Builder</h2>
      
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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Filters</h3>
          <div className="flex gap-2">
            <select 
              className="p-1 border rounded text-sm"
              value={filterToAdd}
              onChange={(e) => setFilterToAdd(e.target.value as FilterType)}
            >
              <option value="concept">Concept Filter</option>
              <option value="date">Date Filter</option>
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
          <div key={filter.id} className="p-3 border rounded mb-2 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="font-medium">
                {filter.type === 'concept' ? 'Concept Filter' : 'Date Filter'} {index + 1}
              </span>
              <button 
                onClick={() => removeFilter(filter.id)}
                className="text-red-500"
                disabled={filters.length === 1}
              >
                Remove
              </button>
            </div>
            
            {index > 0 && (
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
            
            {renderFilterContent(filter, index)}
          </div>
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
    </div>
  );
};

export default EventBuilder;
