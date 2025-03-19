import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions,
  Collapse,
  IconButton,
  Typography,
  Box,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const BaseCard = ({ 
  title, 
  patientCount, 
  chart, 
  sqlQuery, 
  children, 
  expanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [showSql, setShowSql] = useState(false);

  return (
    <Card elevation={3}>
      <CardHeader 
        title={title}
        action={
          <Box sx={{ display: 'flex' }}>
            <IconButton onClick={() => setShowSql(!showSql)}>
              <CodeIcon />
            </IconButton>
            <IconButton 
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        }
      />

      {!isExpanded && (
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Patients: {patientCount}
            </Typography>
            {chart && <Box sx={{ width: '60%', height: 50 }}>{chart}</Box>}
          </Box>
        </CardContent>
      )}

      <Collapse in={isExpanded}>
        <CardContent>
          {children}
        </CardContent>
      </Collapse>

      <Collapse in={showSql}>
        <Divider />
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>SQL Representation:</Typography>
          <SyntaxHighlighter language="sql" style={docco}>
            {sqlQuery || '-- No SQL query available'}
          </SyntaxHighlighter>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default BaseCard;
