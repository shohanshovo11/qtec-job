import { Router } from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController";
import { protect, adminOnly } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createJobSchema, updateJobSchema } from "../schemas/jobSchemas";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, adminOnly, validate(createJobSchema), createJob);
router.put("/:id", protect, adminOnly, validate(updateJobSchema), updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);

export default router;
