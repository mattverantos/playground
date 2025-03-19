import axios from 'axios';

// Mock data for development purposes
const MOCK_DATA = {
  patientCounts: {
    total: 10000,
    withDiabetes: 1200,
    withAsthma: 800,
    withHypertension: 2500,
    withProcedures: 5000
  },
  distributions: {
    age: [
      { group: '0-17', count: 1200 },
      { group: '18-34', count: 2500 },
      { group: '35-50', count: 3100 },
      { group: '51-65', count: 2200 },
      { group: '65+', count: 1000 },
    ],
    gender: [
      { group: 'Male', count: 4800 },
      { group: 'Female', count: 5200 },
    ]
  },
  events: {
    medication: [
      { month: 'Jan', count: 1200 },
      { month: 'Feb', count: 1100 },
      { month: 'Mar', count: 1300 },
      { month: 'Apr', count: 1000 },
      { month: 'May', count: 1100 },
      { month: 'Jun', count: 1400 },
    ],
    condition: [
      { month: 'Jan', count: 800 },
      { month: 'Feb', count: 900 },
      { month: 'Mar', count: 750 },
      { month: 'Apr', count: 820 },
      { month: 'May', count: 880 },
      { month: 'Jun', count: 810 },
    ]
  }
};

/**
 * Fetch patient count based on cohort criteria
 * In development, this returns mock data. In production, it would call an API.
 * 
 * @param {Object} criteria - The cohort criteria
 * @returns {Promise<number>} - The patient count
 */
export async function fetchPatientCount(criteria) {
  // In development, return mock data
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Calculate a mock count based on the criteria
    let count = MOCK_DATA.patientCounts.total;
    
    if (criteria.events?.length > 0) {
      // Reduce count for each event (simulating AND condition)
      count = Math.floor(count * 0.8);
    }
    
    if (criteria.inclusionCriteria?.length > 0) {
      // Reduce count for each inclusion criteria
      count = Math.floor(count * (0.7 - criteria.inclusionCriteria.length * 0.1));
    }
    
    if (criteria.exclusionCriteria?.length > 0) {
      // Reduce count for each exclusion criteria
      count = Math.floor(count * (1 - criteria.exclusionCriteria.length * 0.05));
    }
    
    return count;
  }
  
  // In production, call the API
  try {
    const response = await axios.post('/api/cohort/count', criteria);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching patient count:', error);
    return 0;
  }
}

/**
 * Fetch distribution data for visualization
 * 
 * @param {string} type - The type of distribution (age, gender, etc.)
 * @param {Object} criteria - The cohort criteria
 * @returns {Promise<Array>} - The distribution data
 */
export async function fetchDistribution(type, criteria = {}) {
  // In development, return mock data
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    if (type === 'age') {
      return MOCK_DATA.distributions.age;
    } else if (type === 'gender') {
      return MOCK_DATA.distributions.gender;
    } else if (type.startsWith('event_')) {
      const eventType = type.replace('event_', '');
      return MOCK_DATA.events[eventType] || [];
    }
    
    return [];
  }
  
  // In production, call the API
  try {
    const response = await axios.post(`/api/cohort/distribution/${type}`, criteria);
    return response.data.distribution;
  } catch (error) {
    console.error(`Error fetching ${type} distribution:`, error);
    return [];
  }
}
