import { model, models, ObjectId, Schema } from "mongoose";

interface IUser {
  name: string;
  username: string;
  email: string;
  image: string;
  bio?: string;
  location?: string;
  portfolio?: string;
  reputaiton?: number;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputaiton: { type: Number },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
