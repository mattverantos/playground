import React from 'react';
import { useCohort } from '../contexts/CohortContext';
import { ColumnFilter, Event, Filter, Entity } from '../types/cohort';

const getEntityNames = (eventMap: any, entities: string[]): React.ReactNode => {
  if (entities.length === 0) return <span className="italic text-gray-500">None</span>;
  
  return (
    <>
      {entities.map((e, index) => {
        // Check if this is an event reference or direct entity name
        const isEventReference = eventMap[e] !== undefined;
        
        // Add comma if not the last item
        const separator = index < entities.length - 1 ? <span>, </span> : null;
        
        if (isEventReference) {
          // For event references, return a badge with amber colors (matching other entity badges)
          return (
            <React.Fragment key={e}>
              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                {eventMap[e]?.name || e}
              </span>
              {separator}
            </React.Fragment>
          );
        } else {
          // For direct entities, get entity name from the Entity enum if possible
          let displayName = e;
          // Check if it's a valid Entity enum key and display it nicely
          if (Object.values(Entity).includes(e as Entity)) {
            // Format the enum value to be more readable (e.g., CONDITION -> Condition)
            displayName = e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
          }
          
          return (
            <React.Fragment key={e}>
              <span className="font-bold">{displayName}</span>
              {separator}
            </React.Fragment>
          );
        }
      })}
    </>
  );
};

const EventList: React.FC = () => {
  const { state, dispatch } = useCohort();
  
  const editEvent = (event: Event) => {
    dispatch({ type: 'SET_CURRENT_EVENT', payload: event });
  };
  
  const deleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: id });
    }
  };

  const eventMap = state.events.reduce((acc: Record<string, Event>, event) => {
    acc[event.id] = event;
    return acc;
  }, {});
  
  // Add function to determine event's criteria state
  const getEventState = (eventId: string) => {

    if (state.inclusionCriteria.includes(eventId)) return 'inclusion';
    if (state.exclusionCriteria.includes(eventId)) return 'exclusion';
    return 'none';
  };

  // Find events that reference the given event in their filters (as EntityColumn operands)
  const getEventReferences = (eventId: string): Event[] => {
    return state.events.filter(event => {
      // Skip the event itself
      if (event.id === eventId) return false;
      
      // Check all filters of the event
      return event.filters.some(filter => {
        // Only check column filters with operands
        if (filter.type !== 'column') return false;
        
        const colFilter = filter as ColumnFilter;
        if (!colFilter.operands) return false;
        
        // Check if any operand references the target event
        return colFilter.operands.some(operand => 
          typeof operand === 'object' && 
          operand !== null && 
          'id' in operand && 
          operand.id === eventId
        );
      });
    });
  };
  
  // Find events that use the given event in their entities array (already working correctly)
  const getEntityReferences = (eventId: string): Event[] => {
    return state.events.filter(event => 
      event.id !== eventId && event.entities.includes(eventId)
    );
  };
  
  // Find events that are referenced by the given event's filters (as EntityColumn operands)
  const getEventsReferencedBy = (event: Event): Event[] => {
    // Get all unique event IDs referenced in this event's filters
    const referencedEventIds = new Set<string>();
    
    event.filters.forEach(filter => {
      if (filter.type !== 'column') return;
      
      const colFilter = filter as ColumnFilter;
      if (!colFilter.operands) return;
      
      colFilter.operands.forEach(operand => {
        if (typeof operand === 'object' && 
            operand !== null && 
            'id' in operand && 
            operand.id !== event.id) {
          referencedEventIds.add(operand.id);
        }
      });
    });
    
    // Return the events for these IDs
    return state.events.filter(e => referencedEventIds.has(e.id));
  };
  
  // Find events that are used in the given event's entities array (already working correctly)
  const getEntitiesReferencedBy = (event: Event): Event[] => {
    return state.events.filter(e => 
      e.id !== event.id && event.entities.includes(e.id)
    );
  };
  
  // Render badges for events that reference this event
  const renderEventReferenceBadges = (eventId: string) => {
    const referencingEvents = getEventReferences(eventId);
    const entityReferencingEvents = getEntityReferences(eventId);
    
    if (referencingEvents.length === 0 && entityReferencingEvents.length === 0) return null;
    
    return (
      <div className="mt-2 flex flex-wrap gap-1">
        <span className="text-xs text-gray-500 mr-1">Referenced by:</span>
        {referencingEvents.map(event => (
          <span 
            key={`filter-${event.id}`}
            className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
            title={`This event is referenced by filters in "${event.name}"`}
          >
            {event.name}
          </span>
        ))}
        {entityReferencingEvents.map(event => (
          <span 
            key={`entity-${event.id}`}
            className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs rounded-full"
            title={`This event is used as an entity in "${event.name}"`}
          >
            {event.name} (entity)
          </span>
        ))}
      </div>
    );
  };
  
  // Render badges for events referenced by this event
  const renderReferencingEventBadges = (event: Event) => {
    const referencedEvents = getEventsReferencedBy(event);
    const entityEvents = getEntitiesReferencedBy(event);
    
    if (referencedEvents.length === 0 && entityEvents.length === 0) return null;
    
    return (
      <div className="mt-2 flex flex-wrap gap-1">
        <span className="text-xs text-gray-500 mr-1">References:</span>
        {referencedEvents.map(refEvent => (
          <span 
            key={`filter-${refEvent.id}`}
            className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full"
            title={`This event references "${refEvent.name}" in its filters`}
          >
            {refEvent.name}
          </span>
        ))}
        {entityEvents.map(entEvent => (
          <span 
            key={`entity-${entEvent.id}`}
            className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full"
            title={`This event uses "${entEvent.name}" as an entity`}
          >
            {entEvent.name} (entity)
          </span>
        ))}
      </div>
    );
  };
  
  const renderFilterSummary = (event: Event) => {
    // Helper function to format different operand types
    const formatOperand = (operand: any): string => {
      if (operand === null || operand === undefined) return '';
      
      // Check if operand is an EntityColumn object (has id and column properties)
      if (typeof operand === 'object' && operand !== null && 'id' in operand && 'column' in operand) {
        // Format EntityColumn as "id.column" or display the referenced event name if available
        const eventName = eventMap[operand.id]?.name || operand.id;
        return `${eventName}.${operand.column}`;
      }
      
      // For strings and numbers, just convert to string
      return String(operand);
    };
    
    return (
      <div className="text-sm text-gray-600">
        {/* Display entity with badges and bold text */}
        <div className="font-medium mb-1 flex items-center gap-1">
          <span>Entity:</span> {getEntityNames(eventMap, event.entities)}
        </div>
        
        {event.filters.map((filter: Filter, index: number) => (
          <div key={filter.id} className="mb-1">
            {index > 0 && <span className="font-semibold">{filter.logicalOperator} </span>}
            
            {filter.type === 'column' && (() => {
              // Cast the filter to ColumnFilter when type is 'column'
              const colFilter = filter as ColumnFilter;
              return (
                <span>
                  {colFilter.columnName || 'Column'}{' '}
                  {colFilter.operator && ` ${colFilter.operator}`}{' '}
                  {colFilter.operator === 'BETWEEN' && colFilter.operands && colFilter.operands.length >= 2 ? (
                    `${formatOperand(colFilter.operands[0])} to ${formatOperand(colFilter.operands[1])}`
                  ) : colFilter.operator === 'IN' || colFilter.operator === 'NOT IN' ? (
                    colFilter.operands ? colFilter.operands.map(formatOperand).join(', ') : ''
                  ) : (
                    colFilter.operands && colFilter.operands.length > 0 ? formatOperand(colFilter.operands[0]) : ''
                  )}
                </span>
              );
            })()}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Events</h2>
      
      {state.events.length === 0 ? (
        <p className="text-gray-500">No events defined yet.</p>
      ) : (
        <div className="space-y-3">
          {state.events.map(event => {
            const eventState = getEventState(event.id);
            
            return (
              <div key={event.id} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.name}</h3>
                    {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
                    {renderFilterSummary(event)}
                    {/* Add event reference badges at the bottom left */}
                    {renderEventReferenceBadges(event.id)}
                    {renderReferencingEventBadges(event)}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => editEvent(event)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    
                    {/* Add criteria toggle buttons */}
                    <div className="inline-flex shadow-sm rounded-md" role="group">
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'REMOVE_INCLUSION_CRITERIA', payload: event.id });
                          dispatch({ type: 'REMOVE_EXCLUSION_CRITERIA', payload: event.id });
                        }}
                        className={`px-2 py-1 text-xs font-medium rounded-l-lg
                          ${eventState === 'none'
                            ? 'bg-gray-200 text-gray-800 border border-gray-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        Not Used
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'REMOVE_EXCLUSION_CRITERIA', payload: event.id });
                          dispatch({ type: 'ADD_INCLUSION_CRITERIA', payload: event.id });
                        }}
                        className={`px-2 py-1 text-xs font-medium
                          ${eventState === 'inclusion'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        Include
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'REMOVE_INCLUSION_CRITERIA', payload: event.id });
                          dispatch({ type: 'ADD_EXCLUSION_CRITERIA', payload: event.id });
                        }}
                        className={`px-2 py-1 text-xs font-medium rounded-r-lg
                          ${eventState === 'exclusion'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        Exclude
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
