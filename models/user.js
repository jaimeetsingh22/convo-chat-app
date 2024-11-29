
import { v4 } from "uuid";
import { Schema, Types, model, models } from "mongoose";
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
        default: v4(),
      },
      url: {
        type: String,
        required: false,
        default:
          "https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png",
      },
    },
  },
  { timestamps: true }
);

export const User = models?.User || model("User", userSchema);
