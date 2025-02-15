import { model, models, Schema, Types } from "mongoose";

interface IInteraction {
  author: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: "answer" | "question";
}

const InteractionSchema = new Schema<IInteraction>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  actionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  actionType: { type: String, enum: ["answer", "question"], required: true },
});

const Interaction =
  models?.Interaction || model("Interaction", InteractionSchema);

export default Interaction;

// actionId: It can be referenced to answer, question or user.
// User maybe answering some question, or liking some answer or viewing some question.
