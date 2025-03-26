import { Filter, FilterType, Event, ColumnFilter, OccurrenceFilter } from '../types/cohort';
const columns = [
'condition_type',
'condition_status',
'condition_source',
'condition',
'drug',
'drug_type',
'drug_source',
'route',
'measurement',
'measurement_type',
'measurement_source',
'measurement_value',
'measurement_unit',
'measurement_range_high',
'measurement_range_low',
'procedure',
'procedure_type',
'procedure_modifier',
'procedure_quantity',
'visit',
'visit_type',
'visit_source',
'demographic_race',
'demographic_gender',
];
export const columnOptions = [
  { value: 'condition', label: 'Concept', type: 'string' },
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
    events: Event[];
  }> = ({ filter, updateFilter, events }) => {
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
                    <option value="relative_to_event">RELATIVE TO EVENT</option>
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
            ) : filter.operator === 'relative_to_event' ? (
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Related Event</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={filter.relatedEventId || ''}
                      onChange={(e) => handleUpdate('relatedEventId', e.target.value)}
                    >
                      <option value="">Select event...</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>{event.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date Column</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={filter.relatedColumn || ''}
                      onChange={(e) => handleUpdate('relatedColumn', e.target.value)}
                      disabled={!filter.relatedEventId}
                    >
                      <option value="">Select column...</option>
                      {columnOptions
                        .filter(col => col.type === 'date')
                        .map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Comparison</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={filter.dateComparison || 'before'}
                      onChange={(e) => handleUpdate('dateComparison', e.target.value)}
                    >
                      <option value="before">Before</option>
                      <option value="after">After</option>
                      <option value="same_day">Same Day</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Days Offset (optional)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      placeholder="e.g. 30 for 30 days offset"
                      value={filter.daysOffset || ''}
                      onChange={(e) => handleUpdate('daysOffset', e.target.value ? parseInt(e.target.value) : '')}
                    />
                  </div>
                </div>
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

export default ColumnFilterComponent
