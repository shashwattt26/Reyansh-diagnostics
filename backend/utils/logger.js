// utils/logger.js
const winston = require('winston');
const path = require('path');
const SlackHook = require('winston-slack-webhook-transport');
require('dotenv').config();

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
  })
);

const transports = [
  new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
  new winston.transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
];

// If we are not in production, log to the console
if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), logFormat)
  }));
}

// 🚨 SECURITY/OPS: Add Slack Alerts for Critical Errors
if (process.env.SLACK_WEBHOOK_URL) {
  transports.push(new SlackHook({
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    level: 'error', // Only ping Slack for errors, not general traffic
    formatter: info => {
      return {
        text: `🚨 *Reyansh Diagnostics Alert* 🚨\n*Time:* ${new Date().toISOString()}\n*Message:* ${info.message}`,
      };
    }
  }));
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: transports,
});

logger.stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = logger;