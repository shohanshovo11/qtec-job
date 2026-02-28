import { z } from "zod";

export const LOCATIONS = [
  "Remote",
  "New York, US",
  "San Francisco, US",
  "London, UK",
  "Berlin, Germany",
  "Madrid, Spain",
  "Toronto, Canada",
  "Sydney, Australia",
  "Singapore",
] as const;

export const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Remote",
  "Contract",
  "Internship",
] as const;

export const CATEGORIES = [
  "Design",
  "Engineering",
  "Marketing",
  "Finance",
  "Technology",
  "Sales",
  "Business",
  "Human Resource",
] as const;

export const createJobSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  company: z.string().trim().min(1, "Company is required"),
  logo: z.string().optional().default(""),
  location: z.enum(LOCATIONS, { error: "Invalid location value" }),
  type: z.enum(JOB_TYPES, { error: "Invalid job type" }),
  category: z.enum(CATEGORIES, { error: "Invalid category" }),
  salary: z.string().trim().min(1, "Salary is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  postedAt: z.string().optional().default(""),
  aboutCompany: z.string().optional().default(""),
  experience: z.string().optional().default(""),
  companySize: z.string().optional().default(""),
  companyWebsite: z
    .string()
    .url("Company website must be a valid URL")
    .optional()
    .or(z.literal(""))
    .default(""),
  applicants: z.number().int().nonnegative().optional().default(0),
  responsibilities: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  niceToHave: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
