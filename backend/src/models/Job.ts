import mongoose, { Schema, Document, Types } from "mongoose";
import { LOCATIONS, JOB_TYPES, CATEGORIES } from "../schemas/jobSchemas";

// ─── Interface ─────────────────────────────────────────────────────────────────
export interface IJob {
  _id: Types.ObjectId;
  title: string;
  company: string;
  logo: string;
  location: (typeof LOCATIONS)[number];
  type: (typeof JOB_TYPES)[number];
  category: (typeof CATEGORIES)[number];
  salary: string;
  description: string;
  tags: string[];
  featured: boolean;
  postedAt: string;
  // Detail fields
  aboutCompany: string;
  experience: string;
  companySize: string;
  companyWebsite: string;
  applicants: number;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type JobDocument = IJob & Document;

// ─── Schema ────────────────────────────────────────────────────────────────────
const JobSchema = new Schema<JobDocument>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    logo: { type: String, default: "" },
    location: {
      type: String,
      required: [true, "Location is required"],
      enum: {
        values: [...LOCATIONS],
        message: "{VALUE} is not a valid location",
      },
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: {
        values: [...JOB_TYPES],
        message: "{VALUE} is not a valid job type",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [...CATEGORIES],
        message: "{VALUE} is not a valid category",
      },
    },
    salary: {
      type: String,
      required: [true, "Salary is required"],
      trim: true,
    },
    description: { type: String, required: [true, "Description is required"] },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    postedAt: { type: String, default: "" },
    // Detail fields
    aboutCompany: { type: String, default: "" },
    experience: { type: String, default: "" },
    companySize: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    applicants: { type: Number, default: 0 },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    niceToHave: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
  },
  { timestamps: true },
);

// Text index for keyword search
JobSchema.index({
  title: "text",
  company: "text",
  description: "text",
  tags: "text",
});

export default mongoose.model<JobDocument>("Job", JobSchema);
