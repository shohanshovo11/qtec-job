import { z } from "zod";

const mongoIdRegex = /^[a-f\d]{24}$/i;

export const submitApplicationSchema = z.object({
  jobId: z
    .string()
    .min(1, "jobId is required")
    .regex(mongoIdRegex, "Invalid job ID"),
  name: z.string().trim().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .transform((v) => v.toLowerCase()),
  resumeUrl: z.string().url("Resume URL must be a valid URL"),
  coverNote: z
    .string()
    .min(50, "Cover note must be at least 50 characters")
    .max(1000, "Cover note cannot exceed 1000 characters"),
});

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
