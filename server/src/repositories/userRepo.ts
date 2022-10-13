import { User } from "../models/User";
import { Op } from "sequelize";
import { Event } from "../events";
import BaseRepo from "./baseRepo";
import AppUOW from ".";
import { FriendshipStatus } from "../models/Friend";
import { NotificationType } from "../models/Notification";

export interface IUser {
  username: string;
  password: string;
  isActive: boolean;
  id: number;
}

export type AddFriendMsg = {
  token: string | null;
  friendId: number;
};

export default class UserRepo extends BaseRepo {
  constructor(app: AppUOW) {
    super(app);
    this.initListeners();
  }

  initListeners() {
    const { socket } = this.app;
    socket.on(Event.Login, async (data: { token: string }) => {
      this.app.setAuthToken(data.token);
      this.handleLogin();
    });

    socket.on(Event.AddFriend, async (data: { friendId: number }) => {
      this.addFriend(data.friendId);
    });

    socket.on(Event.Disconnect, () => {
      this.handleDisconnect();
    });

    socket.on(Event.GetUser, this.handleGetUser);
  }

  async registerUser(data: {
    username: string;
    password: string;
    isActive?: boolean;
  }): Promise<string> {
    const user = await User.create(data);
    return user.getDataValue("id") as string;
  }

  async getUsers() {
    return await User.findAll({});
  }

  async getUsersById(ids: Array<number>): Promise<Array<IUser>> {
    const match = ids.map((id) => ({ id }));
    const users = await User.findAll({
      where: {
        [Op.or]: match,
      },
      attributes: { exclude: ["password"] },
    });

    return users.map((user) => user.get());
  }

  // async getById(id: number): Promise<IUser | null> {
  //   const users = await User.findOne({
  //     where: {
  //       id,
  //     },
  //   });
  // }

  async flush() {
    await User.truncate();
  }

  async getUserById(id: number): Promise<IUser | null> {
    const user = await User.findByPk(id);
    return user?.get();
  }

  async getUser(username: string, password: string): Promise<IUser | null> {
    let user = await User.findOne({
      where: {
        username,
        password,
      },
      attributes: { exclude: ["password"] },
    });

    return user === null ? null : (JSON.parse(JSON.stringify(user)) as IUser);
  }

  async updateUserStatus(id: number, isActive: boolean) {
    await User.update(
      {
        isActive,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  async addFriend(friendId: number) {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      let userId = this.app.decodeAuthToken();
      if (!friendId) throw new Error("Firend Id is missing");
      if (userId === friendId)
        throw new Error("User can't add himself as a friend");
      // Check if the user exist
      const users = await this.getUsersById([userId, friendId]);
      const sender = users.find((user) => user.id === userId);
      const receiver = users.find((user) => user.id === friendId);
      if (!sender) throw new Error("User doesn't exist");
      if (!receiver) throw new Error("Receiver no longer exist");

      const friendship = await this.app.friendRepo.getFriendshipRecord(
        sender.id,
        receiver.id
      );

      if (friendship)
        throw new Error(
          friendship.status === FriendshipStatus.PENDING
            ? "Request already sent"
            : friendship.status === FriendshipStatus.FRIENDS
            ? "Already friends"
            : `You got blocked by ${receiver.username}`
        );

      await this.app.friendRepo.addFriend(
        sender.id,
        receiver.id,
        FriendshipStatus.PENDING
      );

      const isSent =
        await this.app.notificationRepo.isFriendshipRequestAlreadySent(
          sender.id,
          receiver.id
        );
      if (isSent != null) throw new Error("Notification already sent");
      // If the receiver active we should send him a notification!
      if (receiver.isActive) {
        // Should send a notification
        // Every user has its own channel which we can ehco the message into
        socket.to(receiver.id.toString()).emit(Event.Notification, {
          type: Event.AcceptFriend,
          from: sender,
        });
      }
      // Store a copy of the request into the notifications table
      await this.app.notificationRepo.pushNotification({
        content: {
          userId: sender.id,
        },
        type: NotificationType.FriendshipRequest,
        userId: receiver.id,
      });
      // Update friends table to be pending
      socket.emit(Event.AddFriend, { ok: true });
    }, Event.AddFriend);
  }

  async handleLogin() {
    const socket = this.app.socket;
    this.errorHandler(async () => {
      const token = this.app.getAuthToken();
      if (token === null) throw new Error("Missing auth token");
      const userId = this.app.userRepo.decodeAuthToken(token);
      await this.updateUserStatus(userId, true);
      socket.emit(Event.Login, { ok: true });
      // Add user to a private room so we can send notifications and other stuff
      socket.join(userId.toString());
    }, Event.Login);
  }

  async handleDisconnect() {
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      await this.updateUserStatus(userId, false);
    }, Event.Disconnect);
  }

  handleGetUser = async () => {
    const { socket } = this.app;
    await this.errorHandler(async () => {
      const userId = this.app.decodeAuthToken();
      let user = await this.getUserById(userId);
      socket.emit(Event.GetUser, user);
    }, Event.GetUser);
  };
}
