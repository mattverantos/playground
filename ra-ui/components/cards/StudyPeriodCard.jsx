import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Typography,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import BaseCard from './BaseCard';
import { generateStudyPeriodSql } from '../../utils/sqlGenerator';

export default function StudyPeriodCard({ period, onUpdate }) {
  const [studyPeriod, setStudyPeriod] = useState(period || {
    beforeDays: 180,
    afterDays: 365,
    periodType: 'relative' // 'relative' or 'fixed'
  });

  const handleChange = (field, value) => {
    const updatedPeriod = { ...studyPeriod, [field]: value };
    setStudyPeriod(updatedPeriod);
    onUpdate(updatedPeriod);
  };

  const sqlQuery = generateStudyPeriodSql(studyPeriod);

  return (
    <BaseCard 
      title="Study Period" 
      patientCount="4,210" 
      sqlQuery={sqlQuery}
    >
      <Typography variant="body1" sx={{ mb: 3 }}>
        Define the time range for your study relative to the index date
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Period Type</InputLabel>
        <Select
          value={studyPeriod.periodType}
          label="Period Type"
          onChange={(e) => handleChange('periodType', e.target.value)}
        >
          <MenuItem value="relative">Relative to Index Date</MenuItem>
          <MenuItem value="fixed">Fixed Date Range</MenuItem>
        </Select>
      </FormControl>

      {studyPeriod.periodType === 'relative' ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Days Before Index"
              type="number"
              fullWidth
              value={studyPeriod.beforeDays}
              onChange={(e) => handleChange('beforeDays', parseInt(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">days</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Days After Index"
              type="number"
              fullWidth
              value={studyPeriod.afterDays}
              onChange={(e) => handleChange('afterDays', parseInt(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">days</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={studyPeriod.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={studyPeriod.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </Grid>
        </Grid>
      )}
    </BaseCard>
  );
}
