import mongoose, { Schema, Document, Types } from "mongoose";

// ─── Interface ─────────────────────────────────────────────────────────────────
export interface IApplication {
  _id: Types.ObjectId;
  job: Types.ObjectId;
  name: string;
  email: string;
  resumeUrl: string;
  coverNote: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationDocument = IApplication & Document;

// ─── Schema ────────────────────────────────────────────────────────────────────
const ApplicationSchema = new Schema<ApplicationDocument>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required"],
    },
    coverNote: {
      type: String,
      required: [true, "Cover note is required"],
      minlength: [50, "Cover note must be at least 50 characters"],
      maxlength: [1000, "Cover note cannot exceed 1000 characters"],
    },
  },
  { timestamps: true },
);

// Prevent the same email from applying to the same job twice
ApplicationSchema.index({ job: 1, email: 1 }, { unique: true });

export default mongoose.model<ApplicationDocument>(
  "Application",
  ApplicationSchema,
);
