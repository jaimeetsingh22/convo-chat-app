// import { Schema, model, models } from "mongoose";

import mongoose from "mongoose"; 
import { v4 } from "uuid";
const { Schema, Types, model, models } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    bio: {
      type: String,
      default: "Hey there I am using convo!",
    },
    avatar: {
      public_id: {
        type: String,
        required: false,
        default:v4() 
      },
      url: {
        type: String,
        required: false,
        default:"https://png.pngitem.com/pimgs/s/421-4212266_transparent-default-avatar-png-default-avatar-images-png.png"
      },
    },
  },
  { timestamps: true }
);

export const User = models?.User || model("User", userSchema);
