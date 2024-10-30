import mongoose from "mongoose"; 
const { Schema, Types, model, models } = mongoose;
import { Chat } from "./chat.js";// for registering before use
import {User} from './user.js';// for registering before use
const messageSchema = new Schema(
  {
    content: String,
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    attachments: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Message = models?.Message || model("Message", messageSchema);
