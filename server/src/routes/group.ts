import { auth } from '../middleware/auth';
import { createGroup, deleteGroup, getGroups, leaveGroup } from '../controllers/group';
import { Router } from 'express';
import RateLimit from 'express-rate-limit';

const groupRouter = Router();

// set up rate limiter: maximum of 5 requests per minute
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to all requests
groupRouter.use(limiter);

groupRouter.route('/').get(auth, getGroups).post(auth, createGroup);
groupRouter.route('/:id').delete(auth, deleteGroup);
groupRouter.route('/:id/leave').delete(auth, leaveGroup);

export default groupRouter;
