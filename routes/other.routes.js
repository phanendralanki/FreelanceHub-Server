import express from "express";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import {
  contact,
  requestCourse,
  getDashboardStats,
} from "../controllers/other.controller.js";

const router = express.Router();

// contact form
router.route("/contact").post(contact);

// request form
router.route("/courserequest").post(requestCourse);

// Get Admin Dashboard stats
router
  .route("/admin/stats")
  .get(isAuthenticated, authorizeAdmin, getDashboardStats);

export default router;
