import { model, models, Schema, Types } from "mongoose";

interface IVote {
  author: Types.ObjectId;
  id: Types.ObjectId;
  type: "question" | "answer";
  voteType: "downvote" | "upvote";
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["downvote", "upvote"], required: true },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
