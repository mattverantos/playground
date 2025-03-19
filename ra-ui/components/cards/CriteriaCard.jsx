import { useState } from 'react';
import { 
  Box, 
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseCard from './BaseCard';
import { generateCriteriaSql } from '../../utils/sqlGenerator';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function CriteriaCard({ title, criteria, availableEvents, onUpdate }) {
  const [selectedEvent, setSelectedEvent] = useState('');

  const handleAddCriteria = () => {
    if (!selectedEvent) return;
    
    const event = availableEvents.find(e => e.name === selectedEvent);
    if (event && !criteria.some(c => c.name === event.name)) {
      onUpdate([...criteria, event]);
    }
    setSelectedEvent('');
  };

  const handleRemoveCriteria = (index) => {
    const updatedCriteria = [...criteria];
    updatedCriteria.splice(index, 1);
    onUpdate(updatedCriteria);
  };

  const patientCount = criteria.length > 0 ? 
    (title === "Inclusion Criteria" ? "2,845" : "412") : "0";

  const chartData = [
    { name: 'Match', value: parseInt(patientCount.replace(/,/g, '')) },
    { name: 'No Match', value: 4210 - parseInt(patientCount.replace(/,/g, '')) }
  ];

  const COLORS = ['#0088FE', '#BBBBBB'];

  const chart = (
    <ResponsiveContainer width="100%" height={50}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={25}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  const sqlQuery = criteria.length > 0 ? 
    generateCriteriaSql(criteria, title.toLowerCase().includes("exclusion")) : 
    null;

  return (
    <BaseCard 
      title={title} 
      patientCount={patientCount} 
      chart={chart}
      sqlQuery={sqlQuery}
    >
      <Typography variant="body1" sx={{ mb: 2 }}>
        {title === "Inclusion Criteria" 
          ? "Select events that patients MUST have"
          : "Select events that patients MUST NOT have"}
      </Typography>

      {criteria.length > 0 ? (
        <List sx={{ mb: 3 }}>
          {criteria.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText 
                primary={item.name}
                secondary={`${item.entity} event`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleRemoveCriteria(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          No criteria added yet
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Event</InputLabel>
          <Select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            label="Select Event"
          >
            {availableEvents.map((event, index) => (
              <MenuItem 
                key={index} 
                value={event.name}
                disabled={criteria.some(c => c.name === event.name)}
              >
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          onClick={handleAddCriteria}
          disabled={!selectedEvent}
        >
          Add to {title}
        </Button>
      </Box>
    </BaseCard>
  );
}
