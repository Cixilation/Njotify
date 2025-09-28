import {create} from 'zustand';


interface NavigationState {
  activeSection: 'home' | 'search' | 'your-posts';
  setActiveSection: (section: 'home' | 'search' | 'your-posts') => void;
}

const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'home', 
  setActiveSection: (section: 'home' | 'search' | 'your-posts') => set({ activeSection: section }),
}));

export default useNavigationStore;
