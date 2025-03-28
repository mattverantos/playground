import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Filter, FilterOperator, Event, EventId } from '../../types/cohort';
import { columnOptions } from '../ColumnFilter';
import FilterWrapper from '../FilterWrapper';

interface FilterSectionProps {
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  events: Event[];
  eventId: EventId;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  setFilters,
  events,
  eventId
}) => {
  // Generate empty column filter template
  const newColumnFilter = (operator?: FilterOperator) => ({
    id: uuidv4(),
    type: 'column' as const,
    logicalOperator: operator,
    columnName: columnOptions[0].value,
    columnType: 'string',
    operator: '=',
    operands: [],
  });

  const addFilter = () => {
    const operator = filters.length > 0 ? 'AND' as FilterOperator : undefined;
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

  return (
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
          eventId={eventId}
          updateFilter={updateFilter}
          removeFilter={removeFilter}
          showLogicalOperator={index > 0}
          events={events}
        />
      ))}
    </div>
  );
};

export default FilterSection;
