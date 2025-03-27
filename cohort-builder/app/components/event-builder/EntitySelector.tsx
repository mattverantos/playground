import React, { useRef, useEffect, useState } from 'react';
import { Event } from '../../types/cohort';
import { domainOptions } from '../../constants/cohort-options';

interface EntitySelectorProps {
  selectedEntities: string[];
  setSelectedEntities: (entities: string[]) => void;
  events: Event[];
  currentEventId?: string;
}

const EntitySelector: React.FC<EntitySelectorProps> = ({
  selectedEntities,
  setSelectedEntities,
  events,
  currentEventId
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate combined entity options (domain tables + existing events)
  const getEntityOptions = () => {
    // Start with standard domain options
    const options = [...domainOptions];
    
    // Add saved events as entity options
    events.forEach(event => {
      // Prevent current event from selecting itself or duplicate options
      if (!currentEventId || event.id !== currentEventId) {
        options.push({
          value: event.id,
          label: `Event: ${event.name}`
        });
      }
    });
    
    return options;
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
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
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
  );
};

export default EntitySelector;
