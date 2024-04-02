import './seed';
import 'colors';
import { ClientToServerEvents, Event, ServerToClientEvents } from './events';
import { errorHandler } from './middleware/errorHandler';
import { Server, Socket } from 'socket.io';
import AppUOW from './repositories';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import groupRouter from './routes/group';
import http from 'http';
import roomRouter from './routes/room';
import userRouter from './routes/user';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, {}>(server, {
  cors: {
    origin: '*',
  },
});

io.on(Event.Connect, (socket: Socket) => {
  new AppUOW(socket);
});

const whiteList = (process.env.CORS_WHITES || '').split('/[ ]*,[ ]*').filter(Boolean);

var corsOptionsDelegate = function (req: Request, callback: Function) {
  var corsOptions;
  if (whiteList.indexOf(req.header('Origin') || '') >= 0) {
    corsOptions = { origin: false };
  } else {
    corsOptions = { origin: true };
  }
  callback(null, corsOptions);
};

io.on(Event.Connect, (socket: Socket) => {
  new AppUOW(socket);
});

app.use(cors(corsOptionsDelegate));
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/room', roomRouter);
app.use('/api/v1/group', groupRouter);
app.all('*', (_req: Request, res: Response) => {
  res.redirect(process.env.TOUCH_ME_CLIENT_URL || 'http://localhost:3000');
});
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`.green.underline.bold));
