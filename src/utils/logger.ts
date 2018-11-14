import * as appRoot from 'app-root-path';
import * as winston from 'winston';

const errorLogFileOpstions = {
  filename: 'error.log', 
  level: 'error', 
  format: winston.format.combine(
    winston.format.json(), 
    winston.format.timestamp(), 
    winston.format.json()),
}

const combinedLogFileOptions = {
  filename: 'combined.log', 
  level: 'info',
  format: winston.format.combine(
    winston.format.json(), 
    winston.format.timestamp(), 
    winston.format.json()),
}

const consoleLogOptions = {
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => { 
      return colorizer.colorize(info.level,`${info.timestamp} [${info.level.toUpperCase()}]`) + `: ${info.message}`; 
    })
  )
}
const colorizer = winston.format.colorize();
  let options: winston.LoggerOptions = {
      level: 'silly',

      transports: [
        new winston.transports.File(errorLogFileOpstions),
        new winston.transports.File(combinedLogFileOptions),
        new winston.transports.Console(consoleLogOptions),
      ]
  }

  export const logger = winston.createLogger(options);
