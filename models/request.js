import { Schema, Types, model, models } from "mongoose";
import { User } from "./user.js";// for registering before use
const requestSchema = new Schema(
  {
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
 
    receiver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
 
   
    
  },
  { timestamps: true }
);

export const Request = models?.Request || model("Request", requestSchema);
