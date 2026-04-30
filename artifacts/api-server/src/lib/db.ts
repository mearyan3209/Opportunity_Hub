import mongoose from "mongoose";
import { logger } from "./logger";

const MONGODB_URI = process.env["MONGODB_URI"];

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required.");
}

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGODB_URI as string, {
      serverSelectionTimeoutMS: 15000,
    });
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error({ err }, "MongoDB connection error");
    throw err;
  }
}
