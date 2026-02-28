import { Request, Response, NextFunction } from "express";
import Job from "../models/Job";
import Application from "../models/Application";
import type { CreateJobInput, UpdateJobInput } from "../schemas/jobSchemas";

// @desc    Get all jobs (with filtering, sorting, pagination)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      search,
      category,
      type,
      location,
      featured,
      sortBy,
      page = "1",
      limit = "9",
    } = req.query as Record<string, string | undefined>;

    const query: Record<string, unknown> = {};

    if (search) query.$text = { $search: search };
    if (category && category !== "All") query.category = category;
    if (type && type !== "All") query.type = type;
    if (location && location !== "All") query.location = location;
    if (featured === "true") query.featured = true;

    const sortOption: Record<string, 1 | -1> =
      sortBy === "salary" ? { salary: 1 } : { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Job.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found." });
      return;
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Admin only
export const createJob = async (
  req: Request<object, object, CreateJobInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Admin only
export const updateJob = async (
  req: Request<{ id: string }, object, UpdateJobInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found." });
      return;
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job (and its applications)
// @route   DELETE /api/jobs/:id
// @access  Admin only
export const deleteJob = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found." });
      return;
    }
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.status(200).json({ success: true, message: "Job deleted." });
  } catch (error) {
    next(error);
  }
};
