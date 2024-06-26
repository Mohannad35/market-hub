import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, errors, splat, json, colorize, simple, metadata } = format;

/**
 * This logger is used to send logs to the local file system.
 * Safe to use in production.
 * Can be used in SSR only since it writes to the local file system.
 */
const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
    splat(),
    json({
      replacer(this, key, value) {
        if (this.label && key === "message") return `[${this.label}] ${value}`;
        return value;
      },
    })
  ),
});

// If we have a Logtail source token, then add a Logtail transport
if (process.env.LOGTAIL_SOURCE_TOKEN) {
  // Create a Logtail client
  const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
  logger.add(new LogtailTransport(logtail));
}

// If we're not in production then **ALSO** log to the `console`
// with the colorized simple
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        simple(),
        printf(
          ({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`
        )
      ),
    })
  );
}

export { logger };
