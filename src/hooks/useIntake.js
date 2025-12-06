import { useEffect } from 'react';
import { useIntakeStore } from '../stores/intakeStore';

export const useIntake = (autoFetch = true) => {
  const intakeStore = useIntakeStore();

  useEffect(() => {
    if (autoFetch) {
      intakeStore.fetchLogs();
    }
  }, [autoFetch]);

  return intakeStore;
};

