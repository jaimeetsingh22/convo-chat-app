// import { Schema, Types, model, models } from "mongoose";
import mongoose from "mongoose"; 
const { Schema, Types, model, models } = mongoose;
import { User } from "./user.js";// for registering before use
const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Chat = models?.Chat || model("Chat", chatSchema);
