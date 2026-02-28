import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api";
import type { AuthUser } from "@/lib/api";

// ─── Store shape ──────────────────────────────────────────────────────────────

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** False until zustand has rehydrated from localStorage */
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      login: (token, user) => {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        delete apiClient.defaults.headers.common["Authorization"];
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "qh-auth",
      // Re-attach Bearer token and mark hydration complete after storage is read
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${state.token}`;
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
