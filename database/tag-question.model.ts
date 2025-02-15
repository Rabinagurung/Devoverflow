import { model, models, Schema, Types } from "mongoose";

interface ITagQuestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;
}

const TagQuestion = new Schema<ITagQuestion>(
  {
    tag: { type: Schema.Types.ObjectId, required: true },
    question: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const Tag = models?.Tag || model<ITagQuestion>("Tag", TagQuestion);

export default Tag;
