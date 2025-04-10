import { Document, model, models, Schema, Types } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  author: Types.ObjectId;
  tags: Types.ObjectId[];
  answers: number;
  views: number;
  upvotes: number;
  downVotes: number;
}

export interface IQuestionDoc extends IQuestion, Document {};

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    answers: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true },
  toObject: { virtuals: true },},
);

const Question =
  models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
