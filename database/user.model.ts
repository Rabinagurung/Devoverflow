import { Document, model, models, Schema } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  portfolio?: string;
  reputaiton?: number;
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputaiton: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
