import { create } from 'zustand';
import { getRestaurantDetails } from '../services/api';

const useSettingsStore = create((set) => ({
  settings: null,
  loading: true,
  error: null,
  
  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getRestaurantDetails();
      set({ settings: data, loading: false });
    } catch (err) {
      console.error('Failed to fetch global settings:', err);
      set({ error: err.message, loading: false });
    }
  },
  
  // Method to manually update the store (useful when admin saves new settings)
  setSettings: (newSettings) => set({ settings: newSettings })
}));

export default useSettingsStore;
