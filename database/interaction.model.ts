import { Document, model, models, Schema, Types } from "mongoose";

export const InteractionActionEnums = [
  "view",
  "post",
  "upvote",
  "downvote",
  "edit",
  "delete",
  "search",
  "bookmark",
] as const;

export interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: string;
}

export interface IInteractionDoc extends IInteraction, Document {}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: InteractionActionEnums, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true }, // 'questionId', 'answerId',
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true },
);

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;

// actionId: It can be referenced to answer, question or user.
// User maybe answering some question, or liking some answer or viewing some question.
