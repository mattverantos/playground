import { Event, EntityColumn, ColumnFilter, ColumnOperator } from '../types/cohort';

export const columnOptions = [
  { value: 'condition_type', label: 'Condition Type', type: 'string' },
  { value: 'condition_status', label: 'Condition Status', type: 'string' },
  { value: 'condition_source', label: 'Condition Source', type: 'string' },
  { value: 'condition', label: 'Condition', type: 'string' },
  { value: 'condition_date', label: 'Condition Date', type: 'date' },
  { value: 'drug', label: 'Drug', type: 'string' },
  { value: 'drug_type', label: 'Drug Type', type: 'string' },
  { value: 'drug_source', label: 'Drug Source', type: 'string' },
  { value: 'drug_date_start', label: 'Drug Date Start', type: 'date' },
  { value: 'drug_date_end', label: 'Drug Date End', type: 'date' },
  { value: 'route', label: 'Route', type: 'string' },
  { value: 'measurement', label: 'Measurement', type: 'string' },
  { value: 'measurement_type', label: 'Measurement Type', type: 'string' },
  { value: 'measurement_source', label: 'Measurement Source', type: 'string' },
  { value: 'measurement_value', label: 'Measurement Value', type: 'numeric' },
  { value: 'measurement_unit', label: 'Measurement Unit', type: 'string' },
  { value: 'measurement_range_high', label: 'Measurement Range High', type: 'numeric' },
  { value: 'measurement_range_low', label: 'Measurement Range Low', type: 'numeric' },
  { value: 'measurement_date_start', label: 'Measurement Date Start', type: 'date' },
  { value: 'measurement_date_end', label: 'Measurement Date End', type: 'date' },
  { value: 'procedure', label: 'Procedure', type: 'string' },
  { value: 'procedure_type', label: 'Procedure Type', type: 'string' },
  { value: 'procedure_modifier', label: 'Procedure Modifier', type: 'string' },
  { value: 'procedure_quantity', label: 'Procedure Quantity', type: 'numeric' },
  { value: 'procedure_date', label: 'Procedure Date', type: 'date' },
  { value: 'visit', label: 'Visit', type: 'string' },
  { value: 'visit_type', label: 'Visit Type', type: 'string' },
  { value: 'visit_source', label: 'Visit Source', type: 'string' },
  { value: 'visit_date_start', label: 'Visit Date Start', type: 'date' },
  { value: 'visit_date_end', label: 'Visit Date End', type: 'date' },
  { value: 'demographic_race', label: 'Race', type: 'string' },
  { value: 'demographic_gender', label: 'Gender', type: 'string' },
  { value: 'demographic_date_of_birth', label: 'Date of Birth', type: 'date' },
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
    const entityMap = events.reduce((acc: any, event) => {
      acc[event.id] = event.name;
      return acc;
    }, {});
  
    const handleUpdate = (field: string, value: any) => {
      updateFilter(filter.id, field, value);
    };

    // Helper to update operands array
    const updateOperands = (values: (string | number | EntityColumn)[]) => {
      handleUpdate('operands', values);
    };
    
    // Check if operand is an EntityColumn
    const isEntityColumn = (operand: any): operand is EntityColumn => {
      return operand && typeof operand === 'object' && 'id' in operand && 'column' in operand;
    };
    
    // Get all available entities from all events for dropdown
    const getEntities = (): string[] => events.map(event => event.id);
  
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
                value={filter.operator || '='}
                onChange={(e) => handleUpdate('operator', e.target.value as ColumnOperator)}
              >
                {isNumeric || isDate ? (
                  <>
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="<=">&lt;=</option>
                    <option value="BETWEEN">BETWEEN</option>
                  </>
                ) : (
                  <>
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value="IN">IN</option>
                    <option value="NOT IN">NOT IN</option>
                  </>
                )}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filter.operator === 'BETWEEN' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Value</label>
                  <div className="flex items-center mb-2">
                    <span className="mr-2 text-sm">Type:</span>
                    <label className="inline-flex items-center mr-3">
                      <input 
                        type="radio" 
                        className="form-radio" 
                        checked={!isEntityColumn(filter.operands?.[0])} 
                        onChange={() => updateOperands(['', filter.operands?.[1] || ''])}
                      />
                      <span className="ml-1 text-sm">Direct Value</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio" 
                        checked={!!isEntityColumn(filter.operands?.[0])} 
                        onChange={() => updateOperands([{ id: '', column: '' }, filter.operands?.[1] || ''])}
                      />
                      <span className="ml-1 text-sm">Entity Column</span>
                    </label>
                  </div>
                  
                  {isEntityColumn(filter.operands?.[0]) ? (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="p-2 border rounded"
                        value={filter.operands?.[0]?.id || ''}
                        onChange={(e) => {
                          const currentOperand = filter.operands?.[0] as EntityColumn || { id: '', column: '' };
                          const updatedOperand = { ...currentOperand, id: e.target.value };
                          updateOperands([updatedOperand, filter.operands?.[1] || '']);
                        }}
                      >
                        <option value="">Select Entity</option>
                        {getEntities().map(entity => (
                          <option key={entity} value={entity}>{entityMap[entity]}</option>
                        ))}
                      </select>
                      <select
                        className="p-2 border rounded"
                        value={filter.operands?.[0]?.column || ''}
                        onChange={(e) => {
                          const currentOperand = filter.operands?.[0] as EntityColumn || { id: '', column: '' };
                          const updatedOperand = { ...currentOperand, column: e.target.value };
                          updateOperands([updatedOperand, filter.operands?.[1] || '']);
                        }}
                      >
                        <option value="">Select Column</option>
                        {columnOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <input
                      type={isDate ? "date" : isNumeric ? "number" : "text"}
                      className="w-full p-2 border rounded"
                      value={typeof filter.operands?.[0] === 'string' || typeof filter.operands?.[0] === 'number' ? filter.operands[0] : ''}
                      onChange={(e) => {
                        const min = e.target.value;
                        const max = filter.operands?.[1] || '';
                        updateOperands([min, max]);
                      }}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Value</label>
                  <div className="flex items-center mb-2">
                    <span className="mr-2 text-sm">Type:</span>
                    <label className="inline-flex items-center mr-3">
                      <input 
                        type="radio" 
                        className="form-radio" 
                        checked={!isEntityColumn(filter.operands?.[1])} 
                        onChange={() => updateOperands([filter.operands?.[0] || '', ''])}
                      />
                      <span className="ml-1 text-sm">Direct Value</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio" 
                        checked={isEntityColumn(filter.operands?.[1])} 
                        onChange={() => updateOperands([filter.operands?.[0] || '', { id: '', column: '' }])}
                      />
                      <span className="ml-1 text-sm">Entity Column</span>
                    </label>
                  </div>
                  
                  {isEntityColumn(filter.operands?.[1]) ? (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="p-2 border rounded"
                        value={filter.operands?.[1]?.id || ''}
                        onChange={(e) => {
                          const currentOperand = filter.operands?.[1] as EntityColumn || { id: '', column: '' };
                          const updatedOperand = { ...currentOperand, id: e.target.value };
                          updateOperands([filter.operands?.[0] || '', updatedOperand]);
                        }}
                      >
                        <option value="">Select Entity</option>
                        {getEntities().map(entity => (
                          <option key={entity} value={entity}>{entityMap[entity]}</option>
                        ))}
                      </select>
                      <select
                        className="p-2 border rounded"
                        value={filter.operands?.[1]?.column || ''}
                        onChange={(e) => {
                          const currentOperand = filter.operands?.[1] as EntityColumn || { id: '', column: '' };
                          const updatedOperand = { ...currentOperand, column: e.target.value };
                          updateOperands([filter.operands?.[0] || '', updatedOperand]);
                        }}
                      >
                        <option value="">Select Column</option>
                        {columnOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <input
                      type={isDate ? "date" : isNumeric ? "number" : "text"}
                      className="w-full p-2 border rounded"
                      value={typeof filter.operands?.[1] === 'string' || typeof filter.operands?.[1] === 'number' ? filter.operands[1] : ''}
                      onChange={(e) => {
                        const min = filter.operands?.[0] || '';
                        const max = e.target.value;
                        updateOperands([min, max]);
                      }}
                    />
                  )}
                </div>
              </>
            ) : filter.operator === 'IN' || filter.operator === 'NOT IN' ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Values (comma separated)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={(filter.operands || [])
                    .filter(op => typeof op === 'string' || typeof op === 'number')
                    .join(', ')}
                  placeholder="value1, value2, value3"
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
                    updateOperands(values);
                  }}
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Entity Columns</label>
                  <div className="flex items-center mb-2">
                    <button 
                      type="button" 
                      className="p-1 text-xs bg-blue-500 text-white rounded"
                      onClick={() => {
                        const newOperands = [...(filter.operands || []), { id: '', column: '' }];
                        updateOperands(newOperands);
                      }}
                    >
                      Add Entity Column
                    </button>
                  </div>
                  
                  {(filter.operands || [])
                    .filter(isEntityColumn)
                    .map((operand: any, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <select
                          className="p-2 border rounded mr-2"
                          value={operand.id}
                          onChange={(e) => {
                            const newOperands = [...(filter.operands || [])];
                            const entityIndex = newOperands.findIndex(
                              op => isEntityColumn(op) && 
                              op.id === operand.id && 
                              op.column === operand.column
                            );
                            if (entityIndex !== -1) {
                              newOperands[entityIndex] = { ...operand, id: e.target.value };
                              updateOperands(newOperands);
                            }
                          }}
                        >
                          <option value="">Select Entity</option>
                          {getEntities().map(entity => (
                            <option key={entity} value={entity}>{entityMap[entity]}</option>
                          ))}
                        </select>
                        <select
                          className="p-2 border rounded mr-2"
                          value={operand.column}
                          onChange={(e) => {
                            const newOperands = [...(filter.operands || [])];
                            const entityIndex = newOperands.findIndex(
                              op => isEntityColumn(op) && 
                              op.id === operand.id && 
                              op.column === operand.column
                            );
                            if (entityIndex !== -1) {
                              newOperands[entityIndex] = { ...operand, column: e.target.value };
                              updateOperands(newOperands);
                            }
                          }}
                        >
                          <option value="">Select Column</option>
                          {columnOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <button 
                          type="button" 
                          className="p-1 text-xs bg-red-500 text-white rounded"
                          onClick={() => {
                            const newOperands = (filter.operands || []).filter(
                              op => !(isEntityColumn(op) && op.id === operand.id && op.column === operand.column)
                            );
                            updateOperands(newOperands);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Value</label>
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-sm">Type:</span>
                  <label className="inline-flex items-center mr-3">
                    <input 
                      type="radio" 
                      className="form-radio" 
                      checked={!isEntityColumn(filter.operands?.[0])} 
                      onChange={() => updateOperands([''])}
                    />
                    <span className="ml-1 text-sm">Direct Value</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      className="form-radio" 
                      checked={!!isEntityColumn(filter.operands?.[0])} 
                      onChange={() => updateOperands([{ id: '', column: '' }])}
                    />
                    <span className="ml-1 text-sm">Entity Column</span>
                  </label>
                </div>
                
                {isEntityColumn(filter.operands?.[0]) ? (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="p-2 border rounded"
                      value={filter.operands?.[0]?.id || ''}
                      onChange={(e) => {
                        const currentOperand = filter.operands?.[0] as EntityColumn || { id: '', column: '' };
                        const updatedOperand = { ...currentOperand, id: e.target.value };
                        updateOperands([updatedOperand]);
                      }}
                    >
                      <option value="">Select Entity</option>
                      {getEntities().map(entity => (
                        <option key={entity} value={entity}>{entityMap[entity]}</option>
                      ))}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={filter.operands?.[0]?.column || ''}
                      onChange={(e) => {
                        const currentOperand = filter.operands?.[0] as EntityColumn || { id: '', column: '' };
                        const updatedOperand = { ...currentOperand, column: e.target.value };
                        updateOperands([updatedOperand]);
                      }}
                    >
                      <option value="">Select Column</option>
                      {columnOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    type={isDate ? "date" : isNumeric ? "number" : "text"}
                    className="w-full p-2 border rounded"
                    value={typeof filter.operands?.[0] === 'string' || typeof filter.operands?.[0] === 'number' ? filter.operands[0] : ''}
                    onChange={(e) => updateOperands([e.target.value])}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

export default ColumnFilterComponent;
