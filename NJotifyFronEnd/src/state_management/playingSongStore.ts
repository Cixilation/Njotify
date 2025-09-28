import { create } from "zustand";
import { PlaylistDetail } from "../model/PlayListDetailModel";

interface MusicState {
  queue: PlaylistDetail[];
  currentSong: PlaylistDetail | null;
  addToQueue: (song: PlaylistDetail) => void;
  addToTopQueue : (song: PlaylistDetail) => void;
  removeFromQueue: (index: number) => void;
  deleteAllFromQueue: () => void;
  playNext: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  currentTime: number;
  duration: number;
  counter: number;
  setCounter: (num: number) => void;
  isPlaying: boolean;
  setPlaying: (isPlaying: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const useMusicStore = create<MusicState>((set) => ({
  queue: [],
  currentSong: null,
  currentTime: 0,
  duration: 0,
  counter: 0,
  isPlaying: false,
  volume: 1,
  addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
  addToTopQueue: (song) => set((state) => ({ queue: [song, ...state.queue] })),
  removeFromQueue: (index: number) =>
    set((state) => ({
      queue: state.queue.filter((_, i) => i !== index),
    })),
  deleteAllFromQueue: () => set({ queue: [] }),
  playNext: () =>
    set((state) => {
      const nextSong = state.queue[0];
      const remainingQueue = state.queue.slice(1);
      return { 
        counter: state.counter + 1,
        currentSong: nextSong, 
        queue: remainingQueue, 
        currentTime: 0,
        isPlaying: true 
      };
    }),  
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setCounter: (number) => set({ counter: number })
}));

export default useMusicStore;
