import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true
  },
  fullName: {
    type: String,
    required: [true, "Please provide a full name"]
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  forgotPasswordToken: {
    type: String,
    default: null
  },
  forgotPasswordTokenExpiry: {
    type: Date,
    default: null
  },
  verifyToken: {
    type: String,
    default: null
  },
  verifyDateTime: {
    type: Date,
    default: null
  },
  verifyTokenExpiry: {
    type: Date,
    default: null
  },
  pagePermissions: {
    admin: {
      type: [String],
      default: []
    },
    user: {
      type: [String],
      default: []
    }
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
