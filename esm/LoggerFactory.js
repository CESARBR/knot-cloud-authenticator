import { createLogger, format, transports } from 'winston';

class LoggerFactory {
  create(settings) {
    return createLogger({
      level: settings.logger.level,
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.align(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
      transports: [
        new transports.Console(),
      ],
    });
  }
}

export default LoggerFactory;
