import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import RazorPay from "razorpay";
import nodeCron from "node-cron";
import { Stats } from "./models/stats.model.js";
const PORT = process.env.PORT;

connectDB();
cloudinary.v2.config({
  cloud_name: "dscmtg4tx",
  api_key: "882633518785947",
  api_secret: "6q8ak1EW3l-mrO3mPQZGwRdY3GU",
});

// razor pay instance
export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// nodecron for every 1 month status
nodeCron.schedule("0 0 0 1 * *", async () => {
  // console.log("a");
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port:  ${PORT}`);
});
