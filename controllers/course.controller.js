import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/course.model.js";
import { Stats } from "../models/stats.model.js";
import getDataUri from "../utils/datauri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";

export const getAllCourses = catchAsyncError(async (req, res, next) => {
  // res.send("Working");
  const courses = await Course.find().select("-lectures");
  // .select("-lectures") - to view only for subscribers
  res.status(200).json({
    success: true,
    courses,
  });
});

export const createCourse = catchAsyncError(async (req, res, next) => {
  // res.send("Working");

  const { title, description, category, createdBy } = req.body;

  //validations
  if (!title || !description || !category || !createdBy)
    return next(new ErrorHandler("Please enter all fields", 400));

  const file = req.file; // we will get this from multer middleware
  // console.log(file);
  // get the uri from utils
  const fileUri = getDataUri(file);
  // console.log(fileUri.content);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  await Course.create({
    title,
    description,
    category,
    createdBy,
    // poster: {
    //   public_id: "temp",
    //   url: "temp",
    // },
    poster: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Course created successfully. You can add lectures now. ",
  });
});

// get course lectures
export const getCourseLectures = catchAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }
  course.views += 1;
  await course.save();
  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});

// add lecture
// Max video size 100MB - because we are using free cloudinary
export const addLecture = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const course = await Course.findById(id);
  if (!course) return next(new ErrorHandler("Course not found", 404));

  //cloudinary upload file here
  const file = req.file; // we will get this from multer middleware
  // console.log(file);
  // get the uri from utils
  const fileUri = getDataUri(file);
  // console.log(fileUri.content);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
  });

  course.lectures.push({
    title,
    description,
    // video: {
    //   public_id: "url",
    //   url: "url",
    // },
    video: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  course.numberOfVideos = course.lectures.length;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture added in the course",
  });
});

export const deleteCourse = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course) return next(new ErrorHandler("Course not found", 404));

  await cloudinary.v2.uploader.destroy(course.poster.public_id);

  for (let i = 0; i < course.lectures.length; i++) {
    const singleLecture = course.lectures[i];
    await cloudinary.v2.uploader.destroy(singleLecture.video.public_id, {
      resource_type: "video",
    });
  }

  await course.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

export const deleteLecture = catchAsyncError(async (req, res, next) => {
  const { courseId, lectureId } = req.query;
  const course = await Course.findById(courseId);
  if (!course) return next(new ErrorHandler("Course not found", 404));

  const lecture = course.lectures.filter((item) => {
    if (item._id.toString() !== lectureId.toString()) return item;
  });

  //delete from cloudinary
  await cloudinary.v2.uploader.destroy(lecture.video.public_id);

  //remove from array
  course.lectures = course.lectures.filter((item) => {
    if (item._id.toString() !== lectureId.toStsring()) return item;
  });
  course.numberOfVideos = course.lectures.length;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture Deleted Successfully",
  });
});

// Views call when Change
Course.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

  const courses = await Course.find({});

  let totalViews = 0;

  for (let i = 0; i < courses.length; i++) {
    totalViews += courses[i].views;
  }

  stats[0].views = totalViews;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});
