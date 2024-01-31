import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
config({
  path: "./config/config.env",
});

const app = express();

//using middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// Importing and using routes
import course from "./routes/course.routes.js";
import user from "./routes/user.routes.js";
import payment from "./routes/payment.routes.js";
import other from "./routes/other.routes.js";
import ErrorMiddleware from "./middlewares/errorHandler.js";

app.use("/api/v1", user);
app.use("/api/v1", course);
app.use("/api/v1", payment);
app.use("/api/v1", other);

app.use(ErrorMiddleware);

export default app;
