import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import IndexDateCard from '../components/cards/IndexDateCard';
import EventsCard from '../components/cards/EventsCard';
import StudyPeriodCard from '../components/cards/StudyPeriodCard';
import CriteriaCard from '../components/cards/CriteriaCard';
import { fetchPatientCount } from '../utils/dataFetcher';

export default function CohortBuilder() {
  const [cohortCriteria, setCohortCriteria] = useState({
    indexDate: null,
    events: [],
    studyPeriod: { start: null, end: null },
    inclusionCriteria: [],
    exclusionCriteria: [],
  });
  
  const [patientCount, setPatientCount] = useState(0);
  
  useEffect(() => {
    // Update patient count based on current criteria
    const updatePatientCount = async () => {
      const count = await fetchPatientCount(cohortCriteria);
      setPatientCount(count);
    };
    
    updatePatientCount();
  }, [cohortCriteria]);

  const handleUpdateCriteria = (section, data) => {
    setCohortCriteria(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          OMOP Cohort Builder
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Current Patient Count: {patientCount}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <EventsCard 
              events={cohortCriteria.events}
              onUpdate={(data) => handleUpdateCriteria('events', data)}
            />
          </Grid>
          <Grid item xs={12}>
            <IndexDateCard 
              data={cohortCriteria.indexDate} 
              availableEvents={cohortCriteria.events}
              onUpdate={(data) => handleUpdateCriteria('indexDate', data)} 
            />
          </Grid>          
          <Grid item xs={12}>
            <StudyPeriodCard 
              period={cohortCriteria.studyPeriod}
              onUpdate={(data) => handleUpdateCriteria('studyPeriod', data)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CriteriaCard 
              title="Inclusion Criteria"
              criteria={cohortCriteria.inclusionCriteria}
              availableEvents={cohortCriteria.events}
              onUpdate={(data) => handleUpdateCriteria('inclusionCriteria', data)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CriteriaCard 
              title="Exclusion Criteria"
              criteria={cohortCriteria.exclusionCriteria}
              availableEvents={cohortCriteria.events}
              onUpdate={(data) => handleUpdateCriteria('exclusionCriteria', data)}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
