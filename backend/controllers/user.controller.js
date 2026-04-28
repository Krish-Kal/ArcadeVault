import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ObjectId } from "mongodb";
import {
  deleteAvatarFromStorage,
  resolveUserAvatar,
  streamAvatarFromStorage,
  uploadAvatarToStorage
} from "../utils/avatarStorage.js";

const buildUserPayload = (user) => ({
  id: user._id,
  _id: user._id,
  email: user.email,
  username: user.username,
  wishlist: user.wishlist,
  avatar: resolveUserAvatar(user),
  avatarVersion: user.avatarVersion || 0
});


// Signup
export const signup = async (req, res) => {
  try {
    const { email, password,username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      username
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};



// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

   res.json({
      message: "Login successful",
      token,
      user: buildUserPayload(user)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};



// Get Wishlist
export const getWishlist = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Returning wishlist:", user.wishlist);

    res.json({ wishlist: user.wishlist });

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};



// Update Wishlist
export const updateWishlist = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Received wishlist to save:", req.body.wishlist);

    user.wishlist = req.body.wishlist;

    await user.save();

    console.log("Saved wishlist:", user.wishlist);

    res.json({ wishlist: user.wishlist });

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(buildUserPayload(user));

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Avatar
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const existingUser = await User.findById(req.user.id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const uploadedAvatar = await uploadAvatarToStorage({
      userId: req.user.id,
      file: req.file
    });

    const previousAvatarFileId = existingUser.avatarFileId;

    existingUser.avatar = uploadedAvatar.avatarUrl;
    existingUser.avatarFileId = uploadedAvatar.avatarFileId;
    existingUser.avatarVersion = uploadedAvatar.avatarVersion;

    const updatedUser = await existingUser.save();

    if (previousAvatarFileId && previousAvatarFileId !== uploadedAvatar.avatarFileId) {
      await deleteAvatarFromStorage(previousAvatarFileId);
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Avatar updated successfully",
      avatar: resolveUserAvatar(updatedUser),
      user: buildUserPayload(updatedUser)
    });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAvatar = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!ObjectId.isValid(fileId)) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    const wasStreamed = await streamAvatarFromStorage(fileId, res);

    if (!wasStreamed && !res.headersSent) {
      return res.status(404).json({ message: "Avatar not found" });
    }
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to load avatar" });
    }
  }
};
