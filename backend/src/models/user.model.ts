import { Schema, Types, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  siteId: Types.ObjectId;
  gender: "male" | "female" | "other";
  designation: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site", 
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
  },
  { timestamps: true } 
);

const User = model<IUser>("User", userSchema);
export default User;
