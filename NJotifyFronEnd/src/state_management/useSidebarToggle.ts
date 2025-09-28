import { create } from 'zustand';


interface SidebarState {
  isQueueVisible: boolean;
  toggleQueueVisibility: () => void;
  isMusicDetailsVisible: boolean;
  toggleMusicDetailsVisibility: () => void;
  isAdvertisementVisible: boolean;
  toggleAdvertisementVisibility: () => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  isQueueVisible: false,
  toggleQueueVisibility: () => set((state) => ({ isQueueVisible: !state.isQueueVisible, isMusicDetailsVisible:true })),
  isMusicDetailsVisible: false,
  toggleMusicDetailsVisibility: () => set((state) => {
    const isMusicDetailsVisible = !state.isMusicDetailsVisible;
    return {
      ...state,
      isMusicDetailsVisible,
      isQueueVisible: isMusicDetailsVisible ? state.isQueueVisible : false,
    };
  }),
  isAdvertisementVisible: false,
  toggleAdvertisementVisibility: () => set((state) => ({ isAdvertisementVisible: !state.isAdvertisementVisible })),

}));

export default useSidebarStore;
