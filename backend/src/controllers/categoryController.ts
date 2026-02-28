import { Request, Response, NextFunction } from "express";
import Job from "../models/Job";
import { CATEGORIES } from "../schemas/jobSchemas";

// @desc    Get all categories with live job counts
// @route   GET /api/categories
// @access  Public
export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const aggregated = await Job.aggregate<{ _id: string; jobCount: number }>([
      { $group: { _id: "$category", jobCount: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      aggregated.map((item) => [item._id, item.jobCount]),
    );

    const data = CATEGORIES.map((name) => ({
      name,
      jobCount: countMap.get(name) ?? 0,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
