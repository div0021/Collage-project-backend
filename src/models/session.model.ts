import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";

export interface SessionDocument extends Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updateAt: Date;
}

const sessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userAgent: { type: String },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const SessionModel = model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
