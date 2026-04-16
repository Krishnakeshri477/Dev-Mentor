import express from 'express';
import { registerUser, authUser, getUserProfile, updateUserProfile } from '../controllers/authController.js';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', registerUser);
router.post('/login', authUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);


export default router;
