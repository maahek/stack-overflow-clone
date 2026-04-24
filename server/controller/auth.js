import mongoose from "mongoose";
import user from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const exisitinguser = await user.findOne({ email });
    if (exisitinguser) {
      return res.status(400).json({ message: "User already exist" });
    }
    const hashpassword = await bcrypt.hash(password, 12);
    const newuser = await user.create({
      name,
      email,
      password: hashpassword,
      phoneNumber,
    });
    const token = jwt.sign(
      { email: newuser.email, id: newuser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({ data: newuser, token });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exisitinguser = await user.findOne({ email });
    if (!exisitinguser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const ispasswordcrct = await bcrypt.compare(
      password,
      exisitinguser.password,
    );
    if (!ispasswordcrct) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { email: exisitinguser.email, id: exisitinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({ data: exisitinguser, token });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};

// For generate a random password
export const generatePassword = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Validation
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }
    if (email && phone) {
      return res.status(400).json({ error: "Enter either email or phone" });
    }

    // Find user
    const foundUser = await user.findOne({ $or: [{ email }, { phone }] });
    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Restriction that a user can change password once a day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (foundUser.forgotPasswordDate) {
      const last = new Date(foundUser.forgotPasswordDate);
      last.setHours(0, 0, 0, 0);

      console.log("Today:", today, "Last:", last);

      if (last.getTime() === today.getTime()) {
        return res
          .status(400)
          .json({ error: "You can use this option only once a day" });
      }
    }

    // Generate and save new password
    const newPassword = generatePassword();
    const hashed = await bcrypt.hash(newPassword, 10);

    foundUser.password = hashed;
    foundUser.forgotPasswordDate = new Date(); // save full Date object
    await foundUser.save();

    return res.json({
      message: "Password reset successfully",
      newPassword,
    });
  } catch (error) {
    console.error("Forgot password error", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getallusers = async (req, res) => {
  try {
    const alluser = await user.find();
    res.status(200).json({ data: alluser });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags, phoneNumber } = req.body.editForm;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "User unavailable" });
  }
  try {
    const updateprofile = await user.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags, phoneNumber: phoneNumber } },
      { new: true },
    );
    res.status(200).json({ data: updateprofile });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};
export const followUser = async (req, res) => {
  try {
    const { id } = req.params; // target user id 
    const userId = req.userId; // current user id 

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (id === userId)
      return res.status(400).json({ message: "Cannot follow yourself" });

    const currentUser = await user.findById(userId);
    const targetUser = await user.findById(id);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = currentUser.following.some(
      (f) => f.toString() === id,
    );

    if (alreadyFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (f) => f.toString() !== id,
      );
      targetUser.followers = targetUser.followers.filter(
        (f) => f.toString() !== userId,
      );
    } else {
      // Follow 
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      followers: targetUser.followers.length,
      following: currentUser.following.length,
      isFollowing: currentUser.following.some((f) => f.toString() === id),
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const targetUser = await user.findById(id).select("name phoneNumber points followers following");
  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    name: targetUser.name,
    phoneNumber: targetUser.phoneNumber,
    points: targetUser.points,   
    followers: targetUser.followers.length,
    following: targetUser.following.length,
    isFollowing: targetUser.followers.some((f) => f.toString() === userId),
  });
};


export const userProfile = async (req, res) => {
  try {
    const userpr = await user.findById(req.userId)
      .select("name email phoneNumber points followers following");
    if (!userpr) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: userpr.name,
      email: userpr.email,
      phoneNumber: userpr.phoneNumber,
      points: userpr.points,
      followers: userpr.followers.length,
      following: userpr.following.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
