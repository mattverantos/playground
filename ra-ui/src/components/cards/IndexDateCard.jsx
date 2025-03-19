import { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import BaseCard from './BaseCard';
import { generateIndexDateSql } from '../../utils/sqlGenerator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchEventDateDistribution } from '../../utils/dataFetcher';

const EVENT_TYPES = ['medication', 'condition', 'procedure', 'observation'];

export default function IndexDateCard({ data, onUpdate, availableEvents = [] }) {
  const [indexData, setIndexData] = useState(data || {
    entity: '',
    dateStrategy: 'first', // first, last, earliest, latest
    eventId: null,
  });
  
  const [distributionData, setDistributionData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if the selected entity/event exists in availableEvents
  const selectedEvent = availableEvents.find(
    event => event.id === indexData.eventId || event.name === indexData.entity
  );
  
  const isValidEvent = Boolean(selectedEvent);

  useEffect(() => {
    // Fetch date distribution data if we have a valid event
    const fetchDistribution = async () => {
      if (isValidEvent && selectedEvent?.id) {
        setLoading(true);
        try {
          // Fetch 10 year distribution
          const data = await fetchEventDateDistribution(selectedEvent.id, 10);
          setDistributionData(data);
        } catch (error) {
          console.error("Failed to fetch date distribution:", error);
          setDistributionData([]);
        } finally {
          setLoading(false);
        }
      } else {
        setDistributionData([]);
      }
    };
    
    fetchDistribution();
  }, [isValidEvent, selectedEvent]);

  const handleChange = (field, value) => {
    let updatedData = { ...indexData, [field]: value };
    
    // If changing entity, see if we can find the corresponding event
    if (field === 'entity') {
      const matchedEvent = availableEvents.find(event => event.entity === value || event.name === value);
      if (matchedEvent) {
        updatedData = { 
          ...updatedData, 
          eventId: matchedEvent.id 
        };
      }
    }
    
    setIndexData(updatedData);
    onUpdate(updatedData);
  };

  const dateDistributionChart = (
    <ResponsiveContainer width="100%" height={50}>
      <BarChart data={distributionData}>
        <XAxis 
          dataKey="year" 
          tick={{fontSize: 10}}
          interval={0}
          height={15}
        />
        <YAxis hide />
        <Tooltip 
          formatter={(value) => [`${value} patients`, 'Count']}
          labelFormatter={(label) => `Year: ${label}`}
        />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );

  const minimizedContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {isValidEvent ? (
        <>
          <Typography variant="body2">
            Selected event: <strong>{selectedEvent?.name}</strong> ({selectedEvent?.entity})
          </Typography>
          {distributionData.length > 0 ? dateDistributionChart : 
            <Typography variant="caption" color="text.secondary">
              {loading ? "Loading distribution data..." : "No distribution data available"}
            </Typography>
          }
        </>
      ) : (
        <Typography variant="body2" color="error">
          Please select an event that is defined in the Events row
        </Typography>
      )}
    </Box>
  );

  const sqlQuery = indexData.entity && isValidEvent ? 
    generateIndexDateSql(indexData) : 
    null;

  console.log('availableEvents', availableEvents);
  return (
    <BaseCard 
      title="Index Date" 
      patientCount={isValidEvent && indexData.entity ? "4,210" : "0"} 
      chart={minimizedContent}
      sqlQuery={sqlQuery}
    >
      <Typography variant="body1" sx={{ mb: 2 }}>
        Select the event that defines the index date for your cohort
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 3 }}>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={indexData.entity}
            onChange={(e) => handleChange('entity', e.target.value)}
            label="Event Type"
          >
            {availableEvents.map(event => (
              <MenuItem 
                key={event.id} 
                value={event.name}
                disabled={EVENT_TYPES.includes(event.name)}
              >
                {event.name} ({event.entity})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Date Strategy
          </Typography>
          <RadioGroup
            value={indexData.dateStrategy}
            onChange={(e) => handleChange('dateStrategy', e.target.value)}
            row
          >
            <FormControlLabel value="first" control={<Radio />} label="First occurrence" />
            <FormControlLabel value="last" control={<Radio />} label="Last occurrence" />
          </RadioGroup>
        </Box>
      </Box>
    </BaseCard>
  );
}
