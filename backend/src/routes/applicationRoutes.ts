import { Router } from "express";
import {
  submitApplication,
  getApplications,
  getApplicationsByJob,
  getApplicationById,
  deleteApplication,
} from "../controllers/applicationController";
import { protect, adminOnly } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { submitApplicationSchema } from "../schemas/applicationSchemas";

const router = Router();

// Public — submit application
router.post("/", validate(submitApplicationSchema), submitApplication);

// Admin only
router.get("/", protect, adminOnly, getApplications);
router.get("/job/:jobId", protect, adminOnly, getApplicationsByJob);
router.get("/:id", protect, adminOnly, getApplicationById);
router.delete("/:id", protect, adminOnly, deleteApplication);

export default router;
