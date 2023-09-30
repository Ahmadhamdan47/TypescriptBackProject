const correlationId =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);
import winston from "winston";
import { NODE_ENV_DEV } from "./src/server/resources/constants";

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    info =>
      `${info.timestamp} ${correlationId}  ${info.level}: ${info.message} `
  )
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console(),
  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: "./logs/error/" + "_error.log",
    maxsize: 8000,
    maxFiles: 10,
    handleExceptions: true,
    level: "error",
  }),

  // Allow to print all the error message inside the all.log file
  // (also the error log that are also printed inside the error.log(
  new winston.transports.File({
    filename: "./logs/all/" + "_all.log",
    maxsize: 8000,
    maxFiles: 10,
    handleExceptions: true,
  }),
];

// Create the logger instance that has to be exported
// and used to log messages.
// shows all the log levels if the server was run in development mode.
// Otherwise, shows only warn and error messages.
export const logger = winston.createLogger({
  defaultMeta: { correlationId },
  level: NODE_ENV_DEV === process.env.NODE_ENV! ? "debug" : "warn",
  levels,
  format: format,
  transports,
});
