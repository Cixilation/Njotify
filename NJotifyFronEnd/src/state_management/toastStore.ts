import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ToastState {
  message: string;
  ToastType: string;
  showToast: boolean;
  setMessage: (message: string) => void;
  setToastType: (type: string) => void;
  setShowToast: (show: boolean) => void;
}

export const useToastStore = create<ToastState>()(
  persist(
    (set) => ({
      message: '',
      ToastType: '',
      showToast: false,
      setMessage: (message) => set({ message }),
      setToastType: (type) => set({ ToastType: type }),
      setShowToast: (show) => set({ showToast: show }),
    }),
    {
      name: 'toast-storage', 
      getStorage: () => localStorage,
    }
  )
);
