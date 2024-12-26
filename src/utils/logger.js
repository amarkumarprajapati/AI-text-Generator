const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../../logs/app.log");

exports.log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
};

exports.error = (error) => {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ERROR: ${error.stack || error}\n`;
  fs.appendFileSync(logFilePath, errorMessage);
};
