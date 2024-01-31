import express from "express";
import {
  getAllCourses,
  createCourse,
  getCourseLectures,
  addLecture,
  deleteCourse,
  deleteLecture,
} from "../controllers/course.controller.js";
import singleUpload from "../middlewares/multer.js";
import {
  authorizeAdmin,
  isAuthenticated,
  authorizeSubscribers,
} from "../middlewares/auth.js";
const router = express.Router();

// Get All courses without lectures
router.route("/courses").get(getAllCourses);

//create new course - only admin
router
  .route("/createCourse")
  .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

// Add lecture,Delete course,Get Course details
router
  .route("/courses/:id")
  .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
  .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
  .delete(isAuthenticated, authorizeAdmin, deleteCourse)
  //deletelecture
  .delete(isAuthenticated, authorizeAdmin, deleteLecture);

export default router;
