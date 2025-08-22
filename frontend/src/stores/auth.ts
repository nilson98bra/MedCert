import { defineStore } from "pinia";
import { logout, me } from "@/services/auth-service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as null | { id: string; email: string; name: string },
  }),
  actions: {
    async fetchUser() {
      try {
        const res = await me();
        this.user = res;
      } catch {
        this.user = null;
      }
    },
    async logout() {
      await logout();
      this.user = null;
    },
  },
});
