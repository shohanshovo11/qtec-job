import { Router } from "express";
import {
  register,
  login,
  getMe,
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminStats,
} from "../controllers/authController";
import { protect, adminOnly } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../schemas/authSchemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

// Admin — user management
router.get("/users", protect, adminOnly, getUsers);
router.patch("/users/:id/role", protect, adminOnly, updateUserRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Admin — stats
router.get("/stats", protect, adminOnly, getAdminStats);

export default router;
