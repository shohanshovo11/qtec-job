import { Request, Response, NextFunction } from "express";
import Application from "../models/Application";
import Job from "../models/Job";
import type { SubmitApplicationInput } from "../schemas/applicationSchemas";

// @desc    Submit a job application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (
  req: Request<object, object, SubmitApplicationInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { jobId, name, email, resumeUrl, coverNote } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found." });
      return;
    }

    const existing = await Application.findOne({ job: jobId, email });
    if (existing) {
      res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
      return;
    }

    const application = await Application.create({
      job: jobId,
      name,
      email,
      resumeUrl,
      coverNote,
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (admin)
// @route   GET /api/applications
// @access  Admin only
export const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "20",
      jobId,
      search,
    } = req.query as Record<string, string | undefined>;

    const query: Record<string, unknown> = jobId ? { job: jobId } : {};
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate("job", "title company")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job (admin)
// @route   GET /api/applications/job/:jobId
// @access  Admin only
export const getApplicationsByJob = async (
  req: Request<{ jobId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application (admin)
// @route   GET /api/applications/:id
// @access  Admin only
export const getApplicationById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job",
      "title company location type salary",
    );
    if (!application) {
      res
        .status(404)
        .json({ success: false, message: "Application not found." });
      return;
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application (admin)
// @route   DELETE /api/applications/:id
// @access  Admin only
export const deleteApplication = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      res
        .status(404)
        .json({ success: false, message: "Application not found." });
      return;
    }

    await Job.findByIdAndUpdate(application.job, { $inc: { applicants: -1 } });
    await application.deleteOne();

    res.status(200).json({ success: true, message: "Application deleted." });
  } catch (error) {
    next(error);
  }
};
