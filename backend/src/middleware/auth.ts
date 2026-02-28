import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

// Verify JWT and attach req.user
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Not authenticated. Please log in." });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "User no longer exists." });
      return;
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

// Allow only admin users
export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role === "admin") {
    next();
    return;
  }
  res.status(403).json({ success: false, message: "Admin access required." });
};
