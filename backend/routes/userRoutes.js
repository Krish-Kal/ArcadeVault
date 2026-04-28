import express from 'express';
import { signup } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';
import { getWishlist } from '../controllers/user.controller.js';
import { updateWishlist } from '../controllers/user.controller.js';
import { avatarUploadMiddleware } from "../utils/multer.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getProfile } from '../controllers/user.controller.js';
import { getAvatar, updateAvatar } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/avatar/:fileId", getAvatar);

router.get("/profile", authMiddleware, getProfile);
router.post("/avatar", authMiddleware, avatarUploadMiddleware, updateAvatar);

router.route("/wishlist")
  .get(authMiddleware, getWishlist)
  .post(authMiddleware, updateWishlist);

export default router;
