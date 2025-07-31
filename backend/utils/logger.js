import fs from 'fs';
import path from 'path';

class Logger {
  constructor() {
    this.logDir = './logs';
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    }) + '\n';
  }

  writeToFile(level, message, meta) {
    const logFile = path.join(this.logDir, `${level}.log`);
    const formattedMessage = this.formatMessage(level, message, meta);
    
    fs.appendFile(logFile, formattedMessage, (err) => {
      if (err) console.error('Error writing to log file:', err);
    });
  }

  info(message, meta = {}) {
    console.log(`[INFO] ${message}`, meta);
    this.writeToFile('info', message, meta);
  }

  error(message, meta = {}) {
    console.error(`[ERROR] ${message}`, meta);
    this.writeToFile('error', message, meta);
  }

  warn(message, meta = {}) {
    console.warn(`[WARN] ${message}`, meta);
    this.writeToFile('warn', message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, meta);
      this.writeToFile('debug', message, meta);
    }
  }
}

export default new Logger();
