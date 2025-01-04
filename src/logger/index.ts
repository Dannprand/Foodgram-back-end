import winston, { format } from "winston";

const loggerFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
})

export const logger = winston.createLogger({
    level: "debug",
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        loggerFormat
    ),
    transports: [new winston.transports.Console({})],
})