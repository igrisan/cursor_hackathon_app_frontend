import { create } from 'zustand';
import { intakeService } from '../services/intake.service';
import { storageService } from '../services/storage.service';

export const useIntakeStore = create((set, get) => ({
  logs: [],
  offlineQueue: [],
  isLogging: false,
  isLoading: false,
  error: null,
  lastSync: null,

  addLog: async (intakeData) => {
    set({ isLogging: true, error: null });
    try {
      const response = await intakeService.createIntake(intakeData);
      const newLog = response.intake || response;
      
      const updatedLogs = [newLog, ...get().logs];
      set({
        logs: updatedLogs,
        isLogging: false,
        lastSync: new Date(),
      });
      
      // Update cache
      await storageService.setCachedLogs(updatedLogs.slice(0, 30)); // Cache last 30 days
      
      return { success: true, data: newLog };
    } catch (error) {
      // If offline, add to queue
      if (!error.response) {
        const queue = get().offlineQueue;
        const queuedItem = {
          ...intakeData,
          id: `temp_${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        const updatedQueue = [...queue, queuedItem];
        
        await storageService.setOfflineQueue(updatedQueue);
        
        set({
          offlineQueue: updatedQueue,
          isLogging: false,
          error: 'Offline - will sync when connection is restored',
        });
        
        return { success: false, error: 'Offline', queued: true };
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to log intake';
      set({
        isLogging: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  deleteLog: async (id) => {
    try {
      await intakeService.deleteIntake(id);
      const updatedLogs = get().logs.filter(log => log.id !== id);
      
      set({ logs: updatedLogs });
      await storageService.setCachedLogs(updatedLogs.slice(0, 30));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  fetchLogs: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    // MOCK DATA FOR TESTING (remove when backend is ready)
    const mockLogs = [
      {
        id: '1',
        puffCount: 5,
        intensity: 'medium',
        context: 'stress',
        notes: 'After a long meeting',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        puffCount: 3,
        intensity: 'low',
        context: 'break',
        notes: 'Coffee break',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        puffCount: 4,
        intensity: 'high',
        context: 'social',
        notes: '',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({
      logs: mockLogs,
      isLoading: false,
      lastSync: new Date(),
    });
    
    return { success: true, data: mockLogs };
  },

  syncOfflineQueue: async () => {
    const queue = get().offlineQueue;
    if (queue.length === 0) return;

    set({ isLoading: true });
    const synced = [];
    const failed = [];

    for (const item of queue) {
      try {
        const response = await intakeService.createIntake(item);
        synced.push(item.id);
      } catch (error) {
        failed.push(item);
      }
    }

    const updatedQueue = failed;
    await storageService.setOfflineQueue(updatedQueue);

    // Refresh logs after sync
    await get().fetchLogs();

    set({
      offlineQueue: updatedQueue,
      isLoading: false,
    });

    return { synced: synced.length, failed: failed.length };
  },

  loadCachedLogs: async () => {
    const cachedLogs = await storageService.getCachedLogs();
    set({ logs: cachedLogs });
    return cachedLogs;
  },

  clearError: () => set({ error: null }),
}));

