import express from "express";
import {
  register,
  login,
  logout,
  getMyProfile,
  changePassword,
  updateProfile,
  updateProfilePicture,
  forgotPassword,
  resetPassword,
  addToPlaylist,
  removeFromPlaylist,
  getAllUsers,
  updateRole,
  deleteUser,
  deleteMyProfile,
} from "../controllers/user.controller.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
const router = express.Router();

//To register a user
router.route("/register").post(singleUpload, register);

// login
router.route("/login").post(login);

// logout
router.route("/logout").get(logout);

// getmyprofile
router.route("/me").get(isAuthenticated, getMyProfile);

//delete my profile
router.route("/deleteMyProfile").delete(isAuthenticated, deleteMyProfile);

//changepassword
router.route("/changePassword").put(isAuthenticated, changePassword);

//updateProfile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

//updateProfilePicture
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateProfilePicture);

// forgetPassword
router.route("/forgetpassword").post(forgotPassword);

// ResetPassword
router.route("/resetPassword/:token").put(resetPassword);

// AddtoPlaylist
router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);
// RemovefromPlaylist
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);

// ************** Admin Routes
router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);
// updating role
router
  .route("/admin/user/:id")
  .put(isAuthenticated, authorizeAdmin, updateRole)
  //delete user
  .delete(isAuthenticated, authorizeAdmin, deleteUser);
export default router;
