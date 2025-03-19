// ...existing code...

/**
 * Fetches date distribution data for a specific event over the past N years
 */
export const fetchDateDistribution = async (
  eventId: string,
  yearsToAggregate: number = 10
) => {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - yearsToAggregate;
    
    const response = await fetch(
      `/api/events/${eventId}/date-distribution?startYear=${startYear}&endYear=${currentYear}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API response into chart-friendly format
    // Expected format: { '2013': 120, '2014': 150, ... }
    const labels = Object.keys(data).sort();
    const values = labels.map(year => data[year]);
    
    return { labels, values };
  } catch (error) {
    console.error("Error fetching date distribution:", error);
    return { labels: [], values: [] };
  }
};

// ...existing code...
