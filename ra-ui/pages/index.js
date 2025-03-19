import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography, Box, AppBar, Toolbar, Button, CircularProgress } from '@mui/material';
import CohortBuilder from '../components/CohortBuilder';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveCohort = async () => {
    setSaving(true);
    // Simulate saving the cohort
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Cohort saved successfully!');
  };

  return (
    <>
      <Head>
        <title>OMOP Cohort Builder</title>
        <meta name="description" content="Build cohorts using the OMOP common data model" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OMOP Cohort Builder
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleSaveCohort}
            disabled={saving}
            startIcon={saving && <CircularProgress size={20} color="inherit" />}
          >
            {saving ? 'Saving...' : 'Save Cohort'}
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <CohortBuilder />
      </Container>
    </>
  );
}
