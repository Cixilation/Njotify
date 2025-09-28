import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../model/UserModel";

interface CurrentUserState {
  current_user: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useCurrentUserStore = create<CurrentUserState>()(
  persist(
    (set) => ({
      current_user: null,
      setCurrentUser: (user) => set({ current_user: user }),
    }),
    {
      name: "current-user-storage",
      getStorage: () => localStorage,
    }
  )
);
