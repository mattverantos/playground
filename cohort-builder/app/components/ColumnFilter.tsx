import { Event, EntityColumn, ColumnFilter, ColumnOperator, EventColumn, Operand, EventId } from '../types/cohort';

export const columnOptions = [
  { value: EntityColumn.CONDITION_TYPE, label: 'Condition Type', type: 'string' },
  { value: EntityColumn.CONDITION_STATUS, label: 'Condition Status', type: 'string' },
  { value: EntityColumn.CONDITION_SOURCE, label: 'Condition Source', type: 'string' },
  { value: EntityColumn.CONDITION, label: 'Condition', type: 'string' },
  { value: EntityColumn.CONDITION_START_DATE, label: 'Condition Date', type: 'date' },
  { value: EntityColumn.DRUG_CONCEPT, label: 'Drug', type: 'string' },
  { value: EntityColumn.DRUG_TYPE, label: 'Drug Type', type: 'string' },
  { value: EntityColumn.DRUG_START_DATE, label: 'Drug Date Start', type: 'date' },
  { value: EntityColumn.DRUG_END_DATE, label: 'Drug Date End', type: 'date' },
  { value: EntityColumn.DRUG_ROUTE, label: 'Route', type: 'string' },
  { value: EntityColumn.DRUG_DOSE, label: 'Dose', type: 'numeric' },
  { value: EntityColumn.MEASUREMENT_TYPE, label: 'Measurement Type', type: 'string' },
  { value: EntityColumn.MEASUREMENT_SOURCE, label: 'Measurement Source', type: 'string' },
  { value: EntityColumn.MEASUREMENT_VALUE, label: 'Measurement Value', type: 'numeric' },
  { value: EntityColumn.MEASUREMENT_UNIT, label: 'Measurement Unit', type: 'string' },
  { value: EntityColumn.MEASUREMENT_RANGE_HIGH, label: 'Measurement Range High', type: 'numeric' },
  { value: EntityColumn.MEASUREMENT_RANGE_LOW, label: 'Measurement Range Low', type: 'numeric' },
  { value: EntityColumn.MEASUREMENT_DATE, label: 'Measurement Date Start', type: 'date' },
  { value: EntityColumn.PROCEDURE, label: 'Procedure', type: 'string' },
  { value: EntityColumn.PROCEDURE_TYPE, label: 'Procedure Type', type: 'string' },
  { value: EntityColumn.PROCEDURE_MODIFIER, label: 'Procedure Modifier', type: 'string' },
  { value: EntityColumn.PROCEDURE_QUANTITY, label: 'Procedure Quantity', type: 'numeric' },
  { value: EntityColumn.PROCEDURE_DATE, label: 'Procedure Date', type: 'date' },
  { value: EntityColumn.VISIT_TYPE, label: 'Visit Type', type: 'string' },
  { value: EntityColumn.VISIT_START_DATE, label: 'Visit Date Start', type: 'date' },
  { value: EntityColumn.VISIT_END_DATE, label: 'Visit Date End', type: 'date' },
  { value: EntityColumn.RACE, label: 'Race', type: 'string' },
  { value: EntityColumn.GENDER, label: 'Gender', type: 'string' },
  { value: EntityColumn.BIRTH_DATE, label: 'Date of Birth', type: 'date' },
];

// Component for Column Filters
const ColumnFilterComponent: React.FC<{
    filter: ColumnFilter;
    eventId: EventId;
    updateFilter: (id: string, field: string, value: any) => void;
    events: Event[];
  }> = ({ filter, eventId, updateFilter, events }) => {
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
    const updateOperands = (values: Operand[]) => {
      handleUpdate('operands', values);
    };
    
    // Check if operand is an EventColumn (previously called EntityColumn in the UI)
    const isEventColumn = (operand: any): operand is EventColumn => {
      return operand && typeof operand === 'object' && 'id' in operand && 'column' in operand;
    };
    
    // Check if operand is a direct EntityColumn reference
    const isEntityColumnRef = (operand: any): boolean => {
      return operand && typeof operand === 'string' && Object.values(EntityColumn).includes(operand as EntityColumn);
    };
    
    // Get all available entities from all events for dropdown
    const getEntities = (): string[] => events.map(event => event.id);
  
    // Determine the value type (direct, entity, or event)
    const getValueType = (operand: any): 'direct' | 'entity' | 'event' => {
      if (isEventColumn(operand)) return 'event';
      if (isEntityColumnRef(operand)) return 'entity';
      return 'direct';
    };

    // Get columns relevant to an event's entity type
    const getEventColumns = (eventId: string) => {
      const event = events.find(e => e.id === eventId);
      if (!event || !event.entities || event.entities.length === 0) return columnOptions;
      
      // Get the first entity from the event's entities array
      const firstEntity = event.entities[0];
      // Extract entity type from entity name or ID (assuming it follows patterns like "CONDITION_xxx", "DRUG_xxx")
      let entityType = '';
      
      // Try to determine entity type from the first entity
      const entityTypes = ['CONDITION', 'DRUG', 'MEASUREMENT', 'PROCEDURE', 'VISIT'];
      for (const type of entityTypes) {
        if (
          (typeof firstEntity === 'string' && firstEntity.startsWith(type)) || 
          (typeof firstEntity === 'object' && firstEntity.id && firstEntity.id.toString().startsWith(type))
        ) {
          entityType = type;
          break;
        }
      }
      
      if (!entityType) return columnOptions;
      
      // Filter columns based on the entity type prefix
      return columnOptions.filter(column => {
        const columnKey = column.value as string;
        // Include columns that match the entity type prefix (like CONDITION_*, DRUG_*, etc.)
        // Also include general columns like RACE, GENDER, BIRTH_DATE
        const generalColumns = [
          EntityColumn.RACE, 
          EntityColumn.GENDER, 
          EntityColumn.BIRTH_DATE
        ];
        
        return columnKey.startsWith(entityType) || 
               generalColumns.includes(column.value as EntityColumn) ||
               // Include any computed columns specific to this event
               (event.computedColumns && event.computedColumns.includes(columnKey));
      });
    };

    // Get event specific columns including computed columns
    const getAllColumnsForEvent = (eventId: string) => {
      const event = events.find(e => e.id === eventId);
      if (!event) return columnOptions;
      
      // Create a copy of the standard column options
      const allColumns = [...columnOptions];
      
      // Add any computed columns from the event
      if (event.computedColumns && event.computedColumns.length > 0) {
        event.computedColumns.forEach(({ id, name }) => {
          // Check if this computed column is already in our options
          const exists = allColumns.some(col => col.value === id);
          if (!exists) {
            // If not, add it with a formatted label
            allColumns.push({
              value: id,
              label: name + ' (Computed)',
              type: 'string' // Default type, you may need to adjust based on your needs
            });
          }
        });
      }
      
      return allColumns;
    };

    console.log('filter', filter, event);

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
                {/* Use the event's computed columns if this filter belongs to an event */}
                {(getAllColumnsForEvent(eventId)).map(option => (
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
                        checked={getValueType(filter.operands?.[0]) === 'direct'} 
                        onChange={() => updateOperands(['', filter.operands?.[1] || ''])}
                      />
                      <span className="ml-1 text-sm">Direct Value</span>
                    </label>
                    <label className="inline-flex items-center mr-3">
                      <input 
                        type="radio" 
                        className="form-radio" 
                        checked={getValueType(filter.operands?.[0]) === 'entity'} 
                        onChange={() => updateOperands([EntityColumn.CONDITION, filter.operands?.[1] || ''])}
                      />
                      <span className="ml-1 text-sm">Entity Column</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio" 
                        checked={getValueType(filter.operands?.[0]) === 'event'} 
                        onChange={() => updateOperands([{ id: '', column: '' }, filter.operands?.[1] || ''])}
                      />
                      <span className="ml-1 text-sm">Event Column</span>
                    </label>
                  </div>
                  
                  {getValueType(filter.operands?.[0]) === 'direct' && (
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
                  
                  {getValueType(filter.operands?.[0]) === 'entity' && (
                    <select
                      className="w-full p-2 border rounded"
                      value={filter.operands?.[0] as EntityColumn || EntityColumn.CONDITION}
                      onChange={(e) => {
                        updateOperands([e.target.value as EntityColumn, filter.operands?.[1] || '']);
                      }}
                    >
                      {Object.values(EntityColumn).map(column => (
                        <option key={column} value={column}>
                          {column.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {getValueType(filter.operands?.[0]) === 'event' && (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="p-2 border rounded"
                        value={isEventColumn(filter.operands?.[0]) ? filter.operands[0].id : ''}
                        onChange={(e) => {
                          const currentOperand = isEventColumn(filter.operands?.[0]) ? filter.operands[0] : { id: '', column: '' };
                          const updatedOperand = { ...currentOperand, id: e.target.value };
                          updateOperands([updatedOperand, filter.operands?.[1] || '']);
                        }}
                      >
                        <option value="">Select Event</option>
                        {getEntities().map(entity => (
                          <option key={entity} value={entity}>{entityMap[entity]}</option>
                        ))}
                      </select>
                      <select
                        className="p-2 border rounded"
                        value={isEventColumn(filter.operands?.[0]) ? filter.operands[0].column : ''}
                        onChange={(e) => {
                          const currentOperand = isEventColumn(filter.operands?.[0]) ? filter.operands[0] : { id: '', column: '' };
                          const updatedOperand = { ...currentOperand, column: e.target.value };
                          updateOperands([updatedOperand, filter.operands?.[1] || '']);
                        }}
                      >
                        <option value="">Select Column</option>
                        {getEventColumns(isEventColumn(filter.operands?.[0]) ? filter.operands[0].id : '').map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
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
                        checked={getValueType(filter.operands?.[1]) === 'direct'} 
                        onChange={() => updateOperands([filter.operands?.[0] || '', ''])}
                      />
                      <span className="ml-1 text-sm">Direct Value</span>
                    </label>
                    <label className="inline-flex items-center mr-3">
                      <input 
                        type="radio" 
                        className="form-radio" 
                        checked={getValueType(filter.operands?.[1]) === 'entity'} 
                        onChange={() => updateOperands([filter.operands?.[0] || '', EntityColumn.CONDITION])}
                      />
                      <span className="ml-1 text-sm">Entity Column</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio" 
                        checked={getValueType(filter.operands?.[1]) === 'event'} 
                        onChange={() => updateOperands([filter.operands?.[0] || '', { id: '', column: '' }])}
                      />
                      <span className="ml-1 text-sm">Event Column</span>
                    </label>
                  </div>
                  
                  {getValueType(filter.operands?.[1]) === 'direct' && (
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
                  
                  {getValueType(filter.operands?.[1]) === 'entity' && (
                    <select
                      className="w-full p-2 border rounded"
                      value={filter.operands?.[1] as EntityColumn || EntityColumn.CONDITION}
                      onChange={(e) => {
                        updateOperands([filter.operands?.[0] || '', e.target.value as EntityColumn]);
                      }}
                    >
                      {Object.values(EntityColumn).map(column => (
                        <option key={column} value={column}>
                          {column.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {getValueType(filter.operands?.[1]) === 'event' && (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="p-2 border rounded"
                        value={isEventColumn(filter.operands?.[1]) ? filter.operands[1].id : ''}
                        onChange={(e) => {
                          const currentOperand = isEventColumn(filter.operands?.[1]) ? filter.operands[1] : { id: '', column: '' };
                          const updatedOperand = { ...currentOperand, id: e.target.value };
                          updateOperands([filter.operands?.[0] || '', updatedOperand]);
                        }}
                      >
                        <option value="">Select Event</option>
                        {getEntities().map(entity => (
                          <option key={entity} value={entity}>{entityMap[entity]}</option>
                        ))}
                      </select>
                      <select
                        className="p-2 border rounded"
                        value={isEventColumn(filter.operands?.[1]) ? filter.operands[1].column : ''}
                        onChange={(e) => {
                          const currentOperand = isEventColumn(filter.operands?.[1]) ? filter.operands[1] : { id: '', column: '' };
                          const updatedOperand = { ...currentOperand, column: e.target.value };
                          updateOperands([filter.operands?.[0] || '', updatedOperand]);
                        }}
                      >
                        <option value="">Select Column</option>
                        {getEventColumns(isEventColumn(filter.operands?.[1]) ? filter.operands[1].id : '').map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
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
                  <div className="flex items-center space-x-2 mb-2">
                    <button 
                      type="button" 
                      className="p-1 text-xs bg-blue-500 text-white rounded"
                      onClick={() => {
                        const newOperands = [...(filter.operands || []), EntityColumn.CONDITION];
                        updateOperands(newOperands);
                      }}
                    >
                      Add Entity Column
                    </button>
                    <button 
                      type="button" 
                      className="p-1 text-xs bg-blue-500 text-white rounded"
                      onClick={() => {
                        const newOperands = [...(filter.operands || []), { id: '', column: '' }];
                        updateOperands(newOperands);
                      }}
                    >
                      Add Event Column
                    </button>
                  </div>
                  
                  {/* Render Entity Column references */}
                  {(filter.operands || [])
                    .filter(isEntityColumnRef)
                    .map((operand, index) => (
                      <div key={`entity-${index}`} className="flex items-center mb-2">
                        <select
                          className="p-2 border rounded mr-2"
                          value={operand as string}
                          onChange={(e) => {
                            const newOperands = [...(filter.operands || [])];
                            const entityIndex = newOperands.findIndex(
                              (op, idx) => isEntityColumnRef(op) && idx === index
                            );
                            if (entityIndex !== -1) {
                              newOperands[entityIndex] = e.target.value as EntityColumn;
                              updateOperands(newOperands);
                            }
                          }}
                        >
                          {Object.values(EntityColumn).map(column => (
                            <option key={column} value={column}>
                              {column.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                            </option>
                          ))}
                        </select>
                        <button 
                          type="button" 
                          className="p-1 text-xs bg-red-500 text-white rounded"
                          onClick={() => {
                            const newOperands = (filter.operands || []).filter(
                              (op, idx) => !(isEntityColumnRef(op) && idx === index)
                            );
                            updateOperands(newOperands);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  
                  {/* Render Event Column references */}
                  {(filter.operands || [])
                    .filter(isEventColumn)
                    .map((operand: any, index) => (
                      <div key={`event-${index}`} className="flex items-center mb-2">
                        <select
                          className="p-2 border rounded mr-2"
                          value={operand.id}
                          onChange={(e) => {
                            const newOperands = [...(filter.operands || [])];
                            const entityIndex = newOperands.findIndex(
                              op => isEventColumn(op) && 
                              op.id === operand.id && 
                              op.column === operand.column
                            );
                            if (entityIndex !== -1) {
                              newOperands[entityIndex] = { ...operand, id: e.target.value };
                              updateOperands(newOperands);
                            }
                          }}
                        >
                          <option value="">Select Event</option>
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
                              op => isEventColumn(op) && 
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
                          {getEventColumns(operand.id).map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <button 
                          type="button" 
                          className="p-1 text-xs bg-red-500 text-white rounded"
                          onClick={() => {
                            const newOperands = (filter.operands || []).filter(
                              op => !(isEventColumn(op) && op.id === operand.id && op.column === operand.column)
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
                      checked={getValueType(filter.operands?.[0]) === 'direct'} 
                      onChange={() => updateOperands([''])}
                    />
                    <span className="ml-1 text-sm">Direct Value</span>
                  </label>
                  <label className="inline-flex items-center mr-3">
                    <input 
                      type="radio" 
                      className="form-radio" 
                      checked={getValueType(filter.operands?.[0]) === 'entity'} 
                      onChange={() => updateOperands([EntityColumn.CONDITION])}
                    />
                    <span className="ml-1 text-sm">Entity Column</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      className="form-radio" 
                      checked={getValueType(filter.operands?.[0]) === 'event'} 
                      onChange={() => updateOperands([{ id: '', column: '' }])}
                    />
                    <span className="ml-1 text-sm">Event Column</span>
                  </label>
                </div>
                
                {getValueType(filter.operands?.[0]) === 'direct' && (
                  <input
                    type={isDate ? "date" : isNumeric ? "number" : "text"}
                    className="w-full p-2 border rounded"
                    value={typeof filter.operands?.[0] === 'string' || typeof filter.operands?.[0] === 'number' ? filter.operands[0] : ''}
                    onChange={(e) => updateOperands([e.target.value])}
                  />
                )}
                
                {getValueType(filter.operands?.[0]) === 'entity' && (
                  <select
                    className="w-full p-2 border rounded"
                    value={filter.operands?.[0] as EntityColumn || EntityColumn.CONDITION}
                    onChange={(e) => updateOperands([e.target.value as EntityColumn])}
                  >
                    {Object.values(EntityColumn).map(column => (
                      <option key={column} value={column}>
                        {column.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                )}
                
                {getValueType(filter.operands?.[0]) === 'event' && (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="p-2 border rounded"
                      value={isEventColumn(filter.operands?.[0]) ? filter.operands[0].id : ''}
                      onChange={(e) => {
                        const currentOperand = isEventColumn(filter.operands?.[0]) ? filter.operands[0] : { id: '', column: '' };
                        const updatedOperand = { ...currentOperand, id: e.target.value };
                        updateOperands([updatedOperand]);
                      }}
                    >
                      <option value="">Select Event</option>
                      {getEntities().map(entity => (
                        <option key={entity} value={entity}>{entityMap[entity]}</option>
                      ))}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={isEventColumn(filter.operands?.[0]) ? filter.operands[0].column : ''}
                      onChange={(e) => {
                        const currentOperand = isEventColumn(filter.operands?.[0]) ? filter.operands[0] : { id: '', column: '' };
                        const updatedOperand = { ...currentOperand, column: e.target.value };
                        updateOperands([updatedOperand]);
                      }}
                    >
                      <option value="">Select Column</option>
                      {getAllColumnsForEvent(isEventColumn(filter.operands?.[0]) ? filter.operands[0].id : '').map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

export default ColumnFilterComponent;
