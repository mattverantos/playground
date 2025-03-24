import { OccurrenceFilter } from '../types/cohort';

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
  
export default OccurrenceFilterComponent
