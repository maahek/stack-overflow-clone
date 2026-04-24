import mongoose from "mongoose";
import { forgotPassword } from "../controller/auth.js";

const userschema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: {type: String, required: false},
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    about: { type: String },
    tags: { type: [String] },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    forgotPasswordDate: { type: Date, default: null },
  },
  { timestamps: true },
);
export default mongoose.model("user", userschema);
