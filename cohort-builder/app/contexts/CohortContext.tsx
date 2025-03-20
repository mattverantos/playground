import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { cohortReducer, initialState } from '../reducers/cohortReducer';
import { CohortAction, CohortState } from '../types/cohort';

type CohortContextType = {
  state: CohortState;
  dispatch: React.Dispatch<CohortAction>;
};

const CohortContext = createContext<CohortContextType | undefined>(undefined);

export const CohortProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cohortReducer, initialState);
  
  return (
    <CohortContext.Provider value={{ state, dispatch }}>
      {children}
    </CohortContext.Provider>
  );
};

export const useCohort = (): CohortContextType => {
  const context = useContext(CohortContext);
  if (context === undefined) {
    throw new Error('useCohort must be used within a CohortProvider');
  }
  return context;
};
