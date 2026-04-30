import mongoose, { Schema, type Document } from "mongoose";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number; // index of correct option
}

export interface OpportunityDoc extends Document {
  title: string;
  category:
    | "School Olympiad"
    | "UG Entrance"
    | "Scholarship"
    | "College/Skill"
    | "Internship";
  level: "School" | "Class 11-12" | "UG Aspirant" | "College Student" | "All";
  description: string;
  eligibility: string;
  deadline: Date;
  officialLink: string;
  syllabus: string[];
  resources: { title: string; url: string }[];
  pyqs: { title: string; url: string }[];
  quiz: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema<QuizQuestion>(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: (v: string[]) => v.length >= 2 },
    answer: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const OpportunitySchema = new Schema<OpportunityDoc>(
  {
    title: { type: String, required: true, trim: true, index: "text" },
    category: {
      type: String,
      enum: [
        "School Olympiad",
        "UG Entrance",
        "Scholarship",
        "College/Skill",
        "Internship",
      ],
      required: true,
    },
    level: {
      type: String,
      enum: ["School", "Class 11-12", "UG Aspirant", "College Student", "All"],
      required: true,
    },
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    deadline: { type: Date, required: true },
    officialLink: { type: String, required: true },
    syllabus: { type: [String], default: [] },
    resources: { type: [ResourceSchema], default: [] },
    pyqs: { type: [ResourceSchema], default: [] },
    quiz: { type: [QuizQuestionSchema], default: [] },
  },
  { timestamps: true },
);

export const Opportunity = mongoose.model<OpportunityDoc>(
  "Opportunity",
  OpportunitySchema,
);
