import { model, models, Schema, Types } from "mongoose";

export interface IInteraction {
  author: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: "answer" | "question";
}

export interface IInteractionDoc extends IInteraction, Document {}

const InteractionSchema = new Schema<IInteraction>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // 'upvote', 'downvote', 'view', 'ask_question',
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
