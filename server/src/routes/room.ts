import { auth } from '../middleware/auth';
import { getRoomMessages } from '../controllers/room';
import express from 'express';
import RateLimit from 'express-rate-limit';

const roomRouter = express.Router();

// set up rate limiter: maximum of 20 requests per minute
var limiter = RateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
roomRouter.use(limiter);

roomRouter.route('/:id').get(auth, getRoomMessages);

export default roomRouter;
