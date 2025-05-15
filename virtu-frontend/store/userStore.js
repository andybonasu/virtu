// store/userStore.js
import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  token: null,
  
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  logout: () => set({ user: null, token: null }),
}));

export default useUserStore;
