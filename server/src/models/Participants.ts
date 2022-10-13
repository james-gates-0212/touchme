import sequelize from "../db";
import { User } from "../models/User";
import { Room } from "./Room";

// Fields: id, roomId, userId
export const Participants = sequelize.define("participants", {});

User.hasMany(Participants, {
  foreignKey: "userId",
});

Participants.belongsTo(User, {
  foreignKey: "userId",
});

Room.hasMany(Participants, {
  foreignKey: "roomId",
});

Participants.belongsTo(Room, {
  foreignKey: "roomId",
});
