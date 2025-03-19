import { useState } from 'react';
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
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const EVENT_TYPES = ['medication', 'condition', 'procedure', 'observation'];

export default function IndexDateCard({ data, onUpdate }) {
  const [indexData, setIndexData] = useState(data || {
    entity: '',
    dateStrategy: 'first', // first, last, earliest, latest
  });

  const handleChange = (field, value) => {
    const updatedData = { ...indexData, [field]: value };
    setIndexData(updatedData);
    onUpdate(updatedData);
  };

  const distributionData = [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 61 },
    { month: 'Apr', count: 58 },
    { month: 'May', count: 48 },
    { month: 'Jun', count: 72 },
  ];

  const chart = (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={distributionData}>
        <XAxis dataKey="month" hide />
        <YAxis hide />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );

  const sqlQuery = indexData.entity ? 
    generateIndexDateSql(indexData) : 
    null;

  return (
    <BaseCard 
      title="Index Date" 
      patientCount={indexData.entity ? "4,210" : "0"} 
      chart={chart}
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
            {EVENT_TYPES.map(type => (
              <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>
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
