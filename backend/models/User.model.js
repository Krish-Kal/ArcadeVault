
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wishlist: { type: Array, default: [] }, 
  avatar: {
    type: String,
    default: "/user.png"
  },
  avatarFileId: {
    type: String,
    default: null
  },
  avatarVersion: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', userSchema);

export default User;
