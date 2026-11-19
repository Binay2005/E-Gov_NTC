import express from "express";

import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaint
} from "../controller/complaint.controller.js";

import { checkAuth, checkAdmin } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.post("/", checkAuth, createComplaint);
router.get("/my", checkAuth, getMyComplaints);

// Admin routes
router.get("/", checkAuth, checkAdmin, getAllComplaints);
router.patch("/:id", checkAuth, checkAdmin, updateComplaint);

export default router;