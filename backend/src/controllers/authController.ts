import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Job from "../models/Job";
import Application from "../models/Application";
import type { RegisterInput, LoginInput } from "../schemas/authSchemas";

const signToken = (id: unknown): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN ??
      "7d") as jwt.SignOptions["expiresIn"],
  });

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res
        .status(409)
        .json({ success: false, message: "Email already in use." });
      return;
    }

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
      return;
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/auth/users?page=1&limit=20&search=
// @access  Admin
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "20",
      search,
    } = req.query as Record<string, string | undefined>;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/auth/users/:id/role
// @access  Admin
export const updateUserRole = async (
  req: Request<{ id: string }, object, { role: "admin" | "user" }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      res
        .status(400)
        .json({ success: false, message: "Role must be admin or user." });
      return;
    }
    // Prevent demoting yourself
    if (req.params.id === String(req.user?._id)) {
      res
        .status(400)
        .json({ success: false, message: "You cannot change your own role." });
      return;
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/auth/users/:id
// @access  Admin
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.params.id === String(req.user?._id)) {
      res
        .status(400)
        .json({
          success: false,
          message: "You cannot delete your own account.",
        });
      return;
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    res.status(200).json({ success: true, message: "User deleted." });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/auth/stats
// @access  Admin
export const getAdminStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [totalJobs, totalUsers, totalApplications, featuredJobs] =
      await Promise.all([
        Job.countDocuments(),
        User.countDocuments(),
        Application.countDocuments(),
        Job.countDocuments({ featured: true }),
      ]);
    res.status(200).json({
      success: true,
      data: { totalJobs, totalUsers, totalApplications, featuredJobs },
    });
  } catch (error) {
    next(error);
  }
};
