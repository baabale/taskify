const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/app.log');

const logEvent = (message, data) => {
  const logMessage = `${new Date().toISOString()} - EVENT: ${message} - DATA: ${JSON.stringify(data)}\n`;
  fs.appendFileSync(logFilePath, logMessage);
};

const logError = (message, error) => {
  const logMessage = `${new Date().toISOString()} - ERROR: ${message} - ERROR: ${error.message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
};

module.exports = {
  logEvent,
  logError,
};
