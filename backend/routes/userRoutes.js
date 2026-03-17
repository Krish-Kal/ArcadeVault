import express from 'express';
import { signup } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';
import { getWishlist } from '../controllers/user.controller.js';
import { updateWishlist } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route("/wishlist")
  .get(getWishlist)
  .post(updateWishlist);

export default router;