import { Filter, FilterType, Event, ColumnFilter, EventId } from '../types/cohort';

import ColumnFilterComponent from "./ColumnFilter";

// Filter Wrapper Component
const FilterWrapper: React.FC<{
    filter: Filter;
    index: number;
    eventId: EventId;
    updateFilter: (id: string, field: string, value: any) => void;
    removeFilter: (id: string) => void;
    showLogicalOperator: boolean;
    events: Event[];
  }> = ({ filter, index, eventId, updateFilter, removeFilter, showLogicalOperator, events }) => {
    return (
      <div key={filter.id} className="p-3 border rounded mb-2 bg-gray-50">
        <div className="flex justify-between mb-2">
          <span className="font-medium">
            {filter.type === 'column' ? 'Column Filter' : 'Filter'} {index + 1}
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
              <option value="NOT">NOT</option>
            </select>
          </div>
        )}
        
        {filter.type === 'column' && (
          <ColumnFilterComponent 
            filter={filter as ColumnFilter} 
            updateFilter={updateFilter}
            eventId={eventId}
            events={events}
          />
        )}
      </div>
    );
  };

export default FilterWrapper;
