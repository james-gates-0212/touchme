import produce from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import {
  addNewMsg,
  getRoomMessagesErr,
  getRoomMessagesReq,
  getRoomMessagesRes,
  resetMessages,
  setCrrRoom,
} from './actions';

export type RoomId = number;

export enum MessageType {
  Text = 'text',
  Audio = 'audio',
  Video = 'video',
  Image = 'image',
}

export interface IMessage {
  id: number;
  type: MessageType;
  body: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
  };
  roomId: RoomId;
}

type State = {
  currRoom: RoomId | null;
  // IDs of the current loading room messages
  loading: {
    [roomId: RoomId]: boolean;
  };
  error: {
    [roomId: RoomId]: string | null;
  };
  messages: {
    [roomId: RoomId]: IMessage[];
  };
};

const initalState: State = {
  currRoom: null,
  loading: {},
  error: {},
  messages: {},
};

export const messagesReducer = createReducer<State>(
  produce(initalState, () => {}),
  (builder) => {
    builder
      .addCase(getRoomMessagesReq, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.loading[payload] = true;
        }),
      )
      .addCase(getRoomMessagesErr, (state, { payload: { roomId, error } }) =>
        produce(state, (draftState) => {
          draftState.loading[roomId] = false;
          draftState.error[roomId] = error;
        }),
      )
      .addCase(getRoomMessagesRes, (state, { payload: { roomId, messages } }) =>
        produce(state, (draftState) => {
          draftState.loading[roomId] = false;
          draftState.error[roomId] = null;
          draftState.messages[roomId] = messages;
        }),
      )
      .addCase(setCrrRoom, (state, { payload }) =>
        produce(state, (draftState) => {
          draftState.currRoom = payload;
        }),
      )
      .addCase(addNewMsg, (state, { payload: msg }) =>
        produce(state, (draftState) => {
          let room = draftState.messages[msg.roomId];
          if (!room) return;
          let isExist = room.some((message) => message.id === msg.id);
          if (isExist) return;
          room.push(msg);
        }),
      )
      .addCase(resetMessages, () => produce(initalState, () => {}));
  },
);
