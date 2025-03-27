import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ComputedColumn, ColumnFunction, Operand, EntityColumn, Event } from '../../types/cohort';
import { functionOptions, entityColumnOptions } from '../../constants/cohort-options';

interface ComputedColumnSectionProps {
  computedColumns: ComputedColumn[];
  setComputedColumns: (columns: ComputedColumn[]) => void;
  selectedEntities: string[];
  events: Event[];
}

const ComputedColumnSection: React.FC<ComputedColumnSectionProps> = ({
  computedColumns,
  setComputedColumns,
  selectedEntities,
  events
}) => {
  // Generate a new computed column template
  const newComputedColumn = (): ComputedColumn => ({
    id: uuidv4(),
    name: '',
    function: 'ADD',
    operands: [],
  });

  const addComputedColumn = () => {
    setComputedColumns([...computedColumns, newComputedColumn()]);
  };

  const removeComputedColumn = (id: string) => {
    setComputedColumns(computedColumns.filter(col => col.id !== id));
  };

  const updateComputedColumn = (id: string, field: string, value: any) => {
    setComputedColumns(
      computedColumns.map(col => {
        if (col.id === id) {
          return { ...col, [field]: value };
        }
        return col;
      })
    );
  };

  const updateComputedColumnOperand = (columnId: string, index: number, value: Operand) => {
    setComputedColumns(
      computedColumns.map(col => {
        if (col.id === columnId) {
          const newOperands = [...(col.operands || [])];
          newOperands[index] = value;
          return { ...col, operands: newOperands };
        }
        return col;
      })
    );
  };

  // Helper function to determine operand type
  const getOperandType = (operand: Operand | undefined): string => {
    if (!operand) return 'literal';
    if (typeof operand === 'string' || typeof operand === 'number') return 'literal';
    if ('column' in operand) return 'entityColumn';
    return 'literal'; // Default
  };

  // Helper function to handle operand type changes
  const handleOperandTypeChange = (columnId: string, operandIndex: number, type: string) => {
    let newOperand: Operand;
    
    switch (type) {
      case 'entityColumn':
        newOperand = { id: uuidv4(), column: '' };
        break;
      case 'literal':
      default:
        newOperand = '';
        break;
    }
    
    updateComputedColumnOperand(columnId, operandIndex, newOperand);
  };

  // Get available columns based on selected entities
  const getAvailableColumns = () => {
    let columns: string[] = [];
    selectedEntities.forEach(entity => {
      // Check if this is a domain entity (like 'visit') or a reference to another event
      if (entityColumnOptions[entity]) {
        // This is a domain entity
        columns = [...columns, ...entityColumnOptions[entity]];
      } else {
        // This might be a reference to another event
        const referencedEvent = events.find(e => e.id === entity);
        if (referencedEvent) {
          // Add computed columns from the referenced event
          const eventColumns = referencedEvent.computedColumns?.map(c => c.name) || [];
          columns = [...columns, ...eventColumns];
        }
      }
    });
    return columns;
  };

  // Render the appropriate input for each operand type
  const renderOperandInput = (columnId: string, operandIndex: number, operand: Operand | undefined) => {
    const type = getOperandType(operand);
    const availableColumns = getAvailableColumns();
    
    switch (type) {
      case 'literal':
        return (
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            value={operand !== undefined ? String(operand) : ''}
            onChange={(e) => {
              // Try to convert to number if possible
              const numValue = Number(e.target.value);
              const newValue = !isNaN(numValue) && e.target.value !== '' ? numValue : e.target.value;
              updateComputedColumnOperand(columnId, operandIndex, newValue);
            }}
            placeholder="Enter value"
          />
        );
        
      case 'entityColumn':
        // For entity columns, we'll show available columns from selected entities
        return (
          <select
            className="flex-1 p-2 border rounded"
            value={(operand as EntityColumn)?.column || ''}
            onChange={(e) => {
              updateComputedColumnOperand(columnId, operandIndex, {
                id: (operand as EntityColumn)?.id || uuidv4(),
                column: e.target.value
              });
            }}
          >
            <option value="">Select a column</option>
            {availableColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Computed Columns</h3>
        <button 
          onClick={addComputedColumn}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Add Computed Column
        </button>
      </div>
      
      {computedColumns.length === 0 && (
        <p className="text-sm text-gray-500 italic">No computed columns defined. Add a column to create derived values.</p>
      )}
      
      {computedColumns.map((column, index) => (
        <div key={column.id} className="mb-3 p-3 border rounded bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 mr-2">
              <label className="block text-sm font-medium mb-1">Column Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={column.name}
                onChange={(e) => updateComputedColumn(column.id, 'name', e.target.value)}
                placeholder="Enter column name"
              />
            </div>
            <div className="flex-1 mr-2">
              <label className="block text-sm font-medium mb-1">Function</label>
              <select
                className="w-full p-2 border rounded"
                value={column.function}
                onChange={(e) => updateComputedColumn(column.id, 'function', e.target.value as ColumnFunction)}
              >
                {functionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => removeComputedColumn(column.id)}
              className="p-1 text-red-600 hover:text-red-800"
              title="Remove computed column"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Operands</label>
            <div className="flex flex-col gap-2">
              {/* Operand 1 */}
              <div className="flex gap-2">
                <select
                  className="w-1/4 p-2 border rounded"
                  value={getOperandType(column.operands?.[0])}
                  onChange={(e) => handleOperandTypeChange(column.id, 0, e.target.value)}
                >
                  <option value="literal">Literal Value</option>
                  <option value="entityColumn">Entity Column</option>
                </select>
                
                {renderOperandInput(column.id, 0, column.operands?.[0])}
              </div>
              
              {/* Operand 2 */}
              <div className="flex gap-2">
                <select
                  className="w-1/4 p-2 border rounded"
                  value={getOperandType(column.operands?.[1])}
                  onChange={(e) => handleOperandTypeChange(column.id, 1, e.target.value)}
                >
                  <option value="literal">Literal Value</option>
                  <option value="entityColumn">Entity Column</option>
                </select>
                
                {renderOperandInput(column.id, 1, column.operands?.[1])}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComputedColumnSection;
