import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password must be atleast 8 characters"],
    select: false,
  },

  role: {
    type: String,
    enum: ["admin", "user"], //Enums in JavaScript are used to represent a fixed set of named values.
    default: "user",
  },

  subscription: {
    //from razor pay
    id: String,
    status: String, //active etc..
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  playlist: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      poster: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: String,
});

// Hashing the password before saving
schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

// checking the password during the login
schema.methods.comparePassword = async function (password) {
  // console.log(this.password);
  return await bcrypt.compare(password, this.password);
};

//JWT Token
schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

//Reset Token
// console.log( crypto.randomBytes(20).toString("hex"));
schema.methods.getResetToken = function () {
  // use crypto - default in nodejs
  const resetToken = crypto.randomBytes(20).toString("hex");

  // algorithm to hash password
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // setting expire
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //15 minutes

  return resetToken;
};

export const User = mongoose.model("User", schema);
