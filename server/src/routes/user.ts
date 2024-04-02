import { auth } from '../middleware/auth';
import { body } from 'express-validator';
import { register, login, getUsers, getFriends } from '../controllers/user';
import { validateReq } from '../middleware/validate';
import express from 'express';
import RateLimit from 'express-rate-limit';

const userRouter = express.Router();

// set up rate limiter: maximum of five requests per minute
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
userRouter.use(limiter);

userRouter
  .route('/register')
  .post(
    body('username').isString(),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Invalid password'),
    validateReq,
    register,
  );

userRouter
  .route('/login')
  .post(
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Invalid password'),
    validateReq,
    login,
  );

userRouter.route('/').get(auth, getUsers);
userRouter.route('/friends').get(auth, getFriends);

export default userRouter;
