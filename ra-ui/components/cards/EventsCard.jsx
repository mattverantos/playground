import { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Grid,
  Typography,
  Chip,
  Stack
} from '@mui/material';
import BaseCard from './BaseCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateEventSql } from '../../utils/sqlGenerator';

const EVENT_TYPES = ['medication', 'condition', 'procedure', 'observation'];
const OPERATORS = {
  date: ['X days after', 'X days before', 'equal', 'after', 'before'],
  string: ['equal', 'like'],
  numeric: ['=', '>', '<', '>=', '<=']
};

export default function EventsCard({ events, onUpdate }) {
  const [newEvent, setNewEvent] = useState({
    name: '',
    entity: '',
    filters: [{ column: '', operator: '', value: '' }]
  });
  
  const [chartData, setChartData] = useState([
    { name: 'Jan', count: 400 },
    { name: 'Feb', count: 300 },
    { name: 'Mar', count: 200 },
    { name: 'Apr', count: 600 },
  ]);

  const handleAddEvent = () => {
    if (newEvent.name && newEvent.entity) {
      onUpdate([...events, newEvent]);
      setNewEvent({
        name: '',
        entity: '',
        filters: [{ column: '', operator: '', value: '' }]
      });
    }
  };

  const handleAddFilter = () => {
    setNewEvent({
      ...newEvent,
      filters: [...newEvent.filters, { column: '', operator: '', value: '' }]
    });
  };

  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...newEvent.filters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    setNewEvent({ ...newEvent, filters: updatedFilters });
  };

  const handleRemoveEvent = (index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    onUpdate(updatedEvents);
  };

  const eventsChart = (
    <ResponsiveContainer width="100%" height={50}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  const sqlQuery = events.length > 0 ? 
    events.map(event => generateEventSql(event)).join("\n\n") : 
    null;

  return (
    <BaseCard 
      title="Events" 
      patientCount={events.length > 0 ? "3,245" : "0"} 
      chart={eventsChart}
      sqlQuery={sqlQuery}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Current Events</Typography>
        {events.length === 0 ? (
          <Typography color="text.secondary">No events added yet</Typography>
        ) : (
          <Stack spacing={1}>
            {events.map((event, index) => (
              <Chip 
                key={index}
                label={`${event.name} (${event.entity})`}
                onDelete={() => handleRemoveEvent(index)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>Add New Event</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Event Name"
            fullWidth
            value={newEvent.name}
            onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Entity Type</InputLabel>
            <Select
              value={newEvent.entity}
              onChange={(e) => setNewEvent({...newEvent, entity: e.target.value})}
              label="Entity Type"
            >
              {EVENT_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Filters</Typography>
      {newEvent.filters.map((filter, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Column"
              fullWidth
              value={filter.column}
              onChange={(e) => handleFilterChange(index, 'column', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select
                value={filter.operator}
                label="Operator"
                onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
              >
                {OPERATORS.string.map(op => (
                  <MenuItem key={op} value={op}>{op}</MenuItem>
                ))}
                {OPERATORS.numeric.map(op => (
                  <MenuItem key={op} value={op}>{op}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Value"
              fullWidth
              value={filter.value}
              onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={handleAddFilter}>
          Add Filter
        </Button>
        <Button variant="contained" onClick={handleAddEvent}>
          Add Event
        </Button>
      </Box>
    </BaseCard>
  );
}
