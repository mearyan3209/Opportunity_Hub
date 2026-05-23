import mongoose from "mongoose";
import { logger } from "./logger";

const MONGODB_URI = process.env["MONGODB_URI"];

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required.");
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function tryConnect(uri: string) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });
}

/**
 * Connect to MongoDB but do not crash the process if the initial attempt fails.
 * Instead, start a background retry loop so the server can still start when
 * the database is temporarily unreachable (for example when switching networks
 * that block DNS SRV queries).
 */
export async function connectDB(): Promise<void> {
  try {
    await tryConnect(MONGODB_URI as string);
    logger.info("MongoDB connected");
    // attach a reconnect handler in case connection drops later
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected, attempting to reconnect in background");
      // start background reconnects but don't block the process
      (async function background() {
        let attempt = 0;
        while (true) {
          attempt += 1;
          try {
            await tryConnect(MONGODB_URI as string);
            logger.info("MongoDB reconnected");
            break;
          } catch (err) {
            logger.warn({ err, attempt }, "Background MongoDB reconnect failed, retrying...");
            await sleep(Math.min(30000, 2000 * attempt));
          }
        }
      })();
    });
  } catch (err) {
    // Log the error but do not propagate so the server can start.
    logger.error({ err }, "MongoDB initial connection failed — starting server without DB and retrying in background");

    // Start background retry loop
    (async function backgroundReconnect() {
      let attempt = 0;
      while (true) {
        attempt += 1;
        try {
          await tryConnect(MONGODB_URI as string);
          logger.info("MongoDB connected (background)");
          break;
        } catch (e) {
          logger.warn({ err: e, attempt }, "MongoDB background connect attempt failed");
          await sleep(Math.min(30000, 2000 * attempt));
        }
      }
    })();
    // resolve so server can continue to start
    return;
  }
}
