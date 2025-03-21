import { logger } from "./logger.js";

export function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
      logger.error(`Missing required environment variable: ${name}`);
      process.exit(1);
    }
    return value;
  }