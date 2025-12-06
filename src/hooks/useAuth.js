import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    if (!authStore.isAuthenticated && !authStore.isLoading) {
      authStore.loadStoredAuth();
    }
  }, []);

  return authStore;
};

