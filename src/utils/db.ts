import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

export async function db() {
  const dbUrl = config.get<string>("dbUrl");

  try {
    await mongoose.connect(dbUrl);
    logger.info("DB is connected...")
  } catch (error) {
    console.error("Could not connect to db", error);
    process.exit(1);
  }
}
