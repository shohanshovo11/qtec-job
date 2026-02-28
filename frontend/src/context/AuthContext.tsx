/**
 * @deprecated Auth is now handled by Zustand — import from "@/store/authStore" instead.
 * This file exists only as a compatibility shim.
 */
export { useAuthStore as useAuth } from "@/store/authStore";
export type { AuthUser } from "@/lib/api";
