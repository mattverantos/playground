/**
 * Generate SQL for events
 * @param {Object} event - Event definition
 * @returns {string} SQL query
 */
export const generateEventSql = (event) => {
  if (!event || !event.entity) {
    return '-- No event defined';
  }

  let sql = `-- SQL for event: ${event.name}\n`;
  
  switch (event.entity) {
    case 'medication':
      sql += `SELECT COUNT(DISTINCT person_id) FROM drug_exposure\n`;
      break;
    case 'condition':
      sql += `SELECT COUNT(DISTINCT person_id) FROM condition_occurrence\n`;
      break;
    case 'procedure':
      sql += `SELECT COUNT(DISTINCT person_id) FROM procedure_occurrence\n`;
      break;
    case 'observation':
      sql += `SELECT COUNT(DISTINCT person_id) FROM observation\n`;
      break;
    default:
      return '-- Unknown event type';
  }

  if (event.filters && event.filters.length > 0) {
    const whereConditions = event.filters
      .filter(filter => filter.column && filter.operator && filter.value)
      .map(filter => {
        return `  ${filter.column} ${filter.operator} '${filter.value}'`;
      });
    
    if (whereConditions.length > 0) {
      sql += `WHERE\n${whereConditions.join(' AND\n')}`;
    }
  }

  return sql;
};

/**
 * Generate SQL for index date
 * @param {Object} indexData - Index date definition
 * @returns {string} SQL query
 */
export const generateIndexDateSql = (indexData) => {
  if (!indexData || !indexData.entity) {
    return '-- No index date defined';
  }

  let sql = `-- SQL for index date using ${indexData.entity} with strategy: ${indexData.dateStrategy}\n`;
  
  switch (indexData.entity) {
    case 'medication':
      sql += `
SELECT person_id, 
  ${indexData.dateStrategy === 'first' ? 'MIN' : 'MAX'}(drug_exposure_start_date) as index_date
FROM drug_exposure
GROUP BY person_id`;
      break;
    case 'condition':
      sql += `
SELECT person_id, 
  ${indexData.dateStrategy === 'first' ? 'MIN' : 'MAX'}(condition_start_date) as index_date
FROM condition_occurrence
GROUP BY person_id`;
      break;
    case 'procedure':
      sql += `
SELECT person_id, 
  ${indexData.dateStrategy === 'first' ? 'MIN' : 'MAX'}(procedure_date) as index_date
FROM procedure_occurrence
GROUP BY person_id`;
      break;
    case 'observation':
      sql += `
SELECT person_id, 
  ${indexData.dateStrategy === 'first' ? 'MIN' : 'MAX'}(observation_date) as index_date
FROM observation
GROUP BY person_id`;
      break;
    default:
      return '-- Unknown event type for index date';
  }

  return sql;
};

/**
 * Generate SQL for study period
 * @param {Object} studyPeriod - Study period definition
 * @returns {string} SQL query
 */
export const generateStudyPeriodSql = (studyPeriod) => {
  if (!studyPeriod) {
    return '-- No study period defined';
  }

  let sql = `-- SQL for study period\n`;
  
  if (studyPeriod.periodType === 'relative') {
    sql += `
-- Using relative time: ${studyPeriod.beforeDays} days before and ${studyPeriod.afterDays} days after index date
SELECT 
  person_id,
  index_date,
  DATE_SUB(index_date, INTERVAL ${studyPeriod.beforeDays} DAY) as study_start_date,
  DATE_ADD(index_date, INTERVAL ${studyPeriod.afterDays} DAY) as study_end_date
FROM cohort_index_dates`;
  } else if (studyPeriod.periodType === 'fixed' && studyPeriod.startDate && studyPeriod.endDate) {
    sql += `
-- Using fixed date range: ${studyPeriod.startDate} to ${studyPeriod.endDate}
SELECT 
  person_id,
  index_date,
  '${studyPeriod.startDate}' as study_start_date,
  '${studyPeriod.endDate}' as study_end_date
FROM cohort_index_dates
WHERE index_date BETWEEN '${studyPeriod.startDate}' AND '${studyPeriod.endDate}'`;
  } else {
    return '-- Incomplete study period definition';
  }

  return sql;
};

/**
 * Generate SQL for criteria
 * @param {Array} criteria - List of criteria
 * @param {boolean} isExclusion - Whether this is an exclusion criteria
 * @returns {string} SQL query
 */
export const generateCriteriaSql = (criteria, isExclusion) => {
  if (!criteria || criteria.length === 0) {
    return `-- No ${isExclusion ? 'exclusion' : 'inclusion'} criteria defined`;
  }

  let sql = `-- SQL for ${isExclusion ? 'exclusion' : 'inclusion'} criteria\n`;
  
  sql += `WITH criteria_patients AS (\n`;
  
  const criteriaQueries = criteria.map((criterion, index) => {
    let query = `  -- Criterion ${index + 1}: ${criterion.name}\n`;
    query += `  SELECT DISTINCT person_id FROM ${getTableForEntity(criterion.entity)}\n`;
    
    if (criterion.filters && criterion.filters.length > 0) {
      const whereConditions = criterion.filters
        .filter(filter => filter.column && filter.operator && filter.value)
        .map(filter => `    ${filter.column} ${filter.operator} '${filter.value}'`);
      
      if (whereConditions.length > 0) {
        query += `  WHERE\n${whereConditions.join(' AND\n')}`;
      }
    }
    
    return query;
  });
  
  sql += criteriaQueries.join(isExclusion ? '\n  UNION\n' : '\n  INTERSECT\n');
  sql += `\n)\n`;
  
  sql += isExclusion ? 
    `SELECT person_id FROM cohort_patients WHERE person_id NOT IN (SELECT person_id FROM criteria_patients)` :
    `SELECT person_id FROM criteria_patients`;
  
  return sql;
};

/**
 * Helper function to get the OMOP table name for a given entity type
 * @param {string} entity - Entity type
 * @returns {string} Table name
 */
function getTableForEntity(entity) {
  switch (entity) {
    case 'medication': return 'drug_exposure';
    case 'condition': return 'condition_occurrence';
    case 'procedure': return 'procedure_occurrence';
    case 'observation': return 'observation';
    default: return entity; // Fallback to entity name if we don't have a mapping
  }
}
