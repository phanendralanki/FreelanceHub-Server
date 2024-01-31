import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  buySubscription,
  cancelSubscription,
  getRazorPayKey,
  paymentVerification,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Buy Subscription
router.route("/subscribe").get(isAuthenticated, buySubscription);

//payment verification and save reference in database.
router.route("/paymentverification").post(isAuthenticated, paymentVerification);

// Get razorpay key
router.route("/razorpaykey").get(getRazorPayKey);

// payment or subscription cancellation
router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

export default router;
