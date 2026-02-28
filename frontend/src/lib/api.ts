import axios, { isAxiosError } from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Axios instance ───────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ─── Error helper ─────────────────────────────────────────────────────────────

/** Typed API error — carries HTTP status + response data. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong.",
): string {
  if (err instanceof ApiError) return err.message;
  if (isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined;
    return (
      (data?.errors as { msg: string }[] | undefined)?.[0]?.msg ??
      (data?.message as string | undefined) ??
      err.message ??
      fallback
    );
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

// ─── API Job type (MongoDB response) ──────────────────────────────────────────
// Mirrors the backend Job model. Uses _id: string instead of id: number.
export interface ApiJob {
  _id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: "Full Time" | "Part Time" | "Remote" | "Contract" | "Internship";
  category: string;
  salary: string;
  postedAt: string;
  description: string;
  tags: string[];
  featured?: boolean;
  createdAt: string;
  // JobDetail fields
  aboutCompany: string;
  experience: string;
  companySize: string;
  companyWebsite: string;
  applicants: number;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
}

export interface ApiCategory {
  name: string;
  jobCount: number;
}

export interface JobsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: ApiJob[];
}

export interface CategoriesResponse {
  success: boolean;
  data: ApiCategory[];
}

// ─── Fetch helpers ─────────────────────────────────────────────────────────────

const EMPTY_JOBS_RESPONSE: JobsResponse = {
  success: false,
  count: 0,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  data: [],
};

/**
 * Fetch a paginated, filtered list of jobs.
 * Used by both server components and the client-side jobs page.
 * - On a server-side API error (4xx/5xx): throws ApiError with status + data.
 * - On a network/timeout error: logs and returns an empty response so server
 *   components degrade gracefully instead of crashing the page.
 */
export async function fetchJobs(
  params: Record<string, string>,
): Promise<JobsResponse> {
  try {
    const { data } = await apiClient.get<JobsResponse>("/api/jobs", { params });
    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      throw new ApiError(
        `Failed to fetch jobs: ${err.response.statusText}`,
        err.response.status,
        err.response.data,
      );
    }
    // Network / timeout — degrade gracefully in server components
    console.error("[api] fetchJobs network error:", (err as Error).message);
    return EMPTY_JOBS_RESPONSE;
  }
}

/**
 * Fetch a single job by MongoDB _id.
 * Returns null if the job does not exist (404).
 * Throws ApiError for all other error responses.
 */
export async function fetchJobById(id: string): Promise<ApiJob | null> {
  try {
    const { data } = await apiClient.get<{ data: ApiJob }>(`/api/jobs/${id}`);
    return data.data ?? null;
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 404) return null;
      throw new ApiError(
        `Failed to fetch job (${id}): ${err.response?.statusText ?? err.message}`,
        err.response?.status,
        err.response?.data,
      );
    }
    throw err;
  }
}

/**
 * Fetch all categories with live job counts.
 * Always returns an array — falls back to [] on any error.
 */
export async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const { data } = await apiClient.get<CategoriesResponse>("/api/categories");
    return data.data ?? [];
  } catch (err) {
    console.error("[api] fetchCategories error:", (err as Error).message);
    return [];
  }
}

// ─── Auth types & helpers ──────────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

/** POST /api/auth/login */
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return data;
}

/** POST /api/auth/register */
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

/** GET /api/auth/me — requires Authorization header already set */
export async function getMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<{ success: boolean; data: AuthUser }>(
    "/api/auth/me",
  );
  return data.data;
}

// ─── Admin API helpers ─────────────────────────────────────────────────────────

export interface AdminStats {
  totalJobs: number;
  totalUsers: number;
  totalApplications: number;
  featuredJobs: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  total: number;
  totalPages: number;
  currentPage: number;
  data: AdminUser[];
}

/** GET /api/auth/stats */
export async function adminGetStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<{ success: boolean; data: AdminStats }>(
    "/api/auth/stats",
  );
  return data.data;
}

/** GET /api/auth/users */
export async function adminGetUsers(
  params?: Record<string, string>,
): Promise<UsersResponse> {
  const { data } = await apiClient.get<UsersResponse>("/api/auth/users", {
    params,
  });
  return data;
}

/** PATCH /api/auth/users/:id/role */
export async function adminUpdateUserRole(
  id: string,
  role: "admin" | "user",
): Promise<AdminUser> {
  const { data } = await apiClient.patch<{ success: boolean; data: AdminUser }>(
    `/api/auth/users/${id}/role`,
    { role },
  );
  return data.data;
}

/** DELETE /api/auth/users/:id */
export async function adminDeleteUser(id: string): Promise<void> {
  await apiClient.delete(`/api/auth/users/${id}`);
}

/** POST /api/jobs (admin) */
export async function adminCreateJob(
  body: Record<string, unknown>,
): Promise<ApiJob> {
  const { data } = await apiClient.post<{ success: boolean; data: ApiJob }>(
    "/api/jobs",
    body,
  );
  return data.data;
}

/** PUT /api/jobs/:id (admin) */
export async function adminUpdateJob(
  id: string,
  body: Record<string, unknown>,
): Promise<ApiJob> {
  const { data } = await apiClient.put<{ success: boolean; data: ApiJob }>(
    `/api/jobs/${id}`,
    body,
  );
  return data.data;
}

/** DELETE /api/jobs/:id (admin) */
export async function adminDeleteJob(id: string): Promise<void> {
  await apiClient.delete(`/api/jobs/${id}`);
}

// ─── Applications ──────────────────────────────────────────────────────────────

export interface ApiApplication {
  _id: string;
  job: { _id: string; title: string; company: string } | string;
  name: string;
  email: string;
  resumeUrl: string;
  coverNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: ApiApplication[];
}

/** GET /api/applications?jobId=...&page=...&limit=... (admin) */
export async function adminGetApplications(
  params?: Record<string, string>,
): Promise<ApplicationsResponse> {
  const { data } = await apiClient.get<ApplicationsResponse>(
    "/api/applications",
    { params },
  );
  return data;
}

/** DELETE /api/applications/:id (admin) */
export async function adminDeleteApplication(id: string): Promise<void> {
  await apiClient.delete(`/api/applications/${id}`);
}

/** GET /api/jobs (admin — higher limit) */
export async function adminGetJobs(
  params?: Record<string, string>,
): Promise<JobsResponse> {
  const { data } = await apiClient.get<JobsResponse>("/api/jobs", {
    params: { limit: "100", ...params },
  });
  return data;
}
