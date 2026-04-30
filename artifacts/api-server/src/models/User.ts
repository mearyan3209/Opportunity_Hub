import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface QuizScoreEntry {
  opportunityId: Types.ObjectId;
  score: number;
  total: number;
  takenAt: Date;
}

export interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  educationLevel: "School" | "Class 11-12" | "UG Aspirant" | "College Student";
  savedOpportunities: Types.ObjectId[];
  progress: number;
  quizScores: QuizScoreEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizScoreSchema = new Schema<QuizScoreEntry>(
  {
    opportunityId: { type: Schema.Types.ObjectId, ref: "Opportunity", required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    takenAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    educationLevel: {
      type: String,
      enum: ["School", "Class 11-12", "UG Aspirant", "College Student"],
      default: "College Student",
    },
    savedOpportunities: [
      { type: Schema.Types.ObjectId, ref: "Opportunity", default: [] },
    ],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    quizScores: { type: [QuizScoreSchema], default: [] },
  },
  { timestamps: true },
);

export const User = mongoose.model<UserDoc>("User", UserSchema);
