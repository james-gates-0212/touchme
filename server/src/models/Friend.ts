import { DataTypes, ModelDefined, Optional } from 'sequelize';
import sequelize from '../db';
import { Room } from './Room';
import { User } from './User';

export enum UsersRelation {
  Friends = 'friends',
  NotFriends = 'not-friends',
  PendingRequest = 'pending-request',
  PendingResponse = 'pending-response',
}

export enum FriendshipStatus {
  Pending = 'pending',
  Friends = 'friends',
  Blocked = 'blocked',
}

export interface IFriend {
  id: number;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
  userId: number;
  friendId: number;
  roomId: number;
}

export const Friend: ModelDefined<
  IFriend,
  Optional<IFriend, 'id' | 'createdAt' | 'updatedAt' | 'roomId'>
> = sequelize.define('friend', {
  status: {
    type: DataTypes.ENUM(FriendshipStatus.Pending, FriendshipStatus.Blocked, FriendshipStatus.Friends),
    allowNull: false,
  },
});

const foreignKeys = ['userId', 'friendId'];

foreignKeys.forEach((name) => {
  const options = {
    foreignKey: {
      name,
      allowNull: false,
    },
  };
  User.hasMany(Friend, options);
  Friend.belongsTo(User, options);
});

Room.hasOne(Friend); // Should create roomId on the `friends` table
Friend.belongsTo(Room);
