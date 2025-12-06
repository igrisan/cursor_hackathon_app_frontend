import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    // HARDCODED LOGIN FOR TESTING (remove when backend is ready)
    const TEST_EMAIL = 'test@smokeless.ai';
    const TEST_PASSWORD = 'password123';
    
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: TEST_EMAIL,
      };
      const mockToken = 'mock-jwt-token-12345';
      
      await storageService.setAuthToken(mockToken);
      await storageService.setUserData(mockUser);
      
      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    }
    
    // If not test credentials, try real API (will fail without backend)
    try {
      const response = await authService.login(email, password);
      const { user, token } = response;
      
      await storageService.setAuthToken(token);
      await storageService.setUserData(user);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = 'Invalid credentials. Use test@smokeless.ai / password123';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    // MOCK REGISTRATION FOR TESTING (remove when backend is ready)
    const mockUser = {
      id: '1',
      name: userData.name || 'New User',
      email: userData.email,
    };
    const mockToken = 'mock-jwt-token-12345';
    
    await storageService.setAuthToken(mockToken);
    await storageService.setUserData(mockUser);
    
    set({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    
    return { success: true };
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storageService.removeAuthToken();
      await storageService.removeUserData();
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(userData);
      const updatedUser = response.user || response;
      
      await storageService.setUserData(updatedUser);
      
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Update failed';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  loadStoredAuth: async () => {
    set({ isLoading: true });
    try {
      const [token, userData] = await Promise.all([
        storageService.getAuthToken(),
        storageService.getUserData(),
      ]);

      if (token && userData) {
        // Use stored data directly (skip API verification for now)
        // In production, you'd verify the token with the backend
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

