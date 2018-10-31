import config from 'config';
import { createLogger, format, transports } from 'winston';

class LoggerFactory {
  create() {
    if (!config.has('logger.level')) {
      throw new Error('Missing logger configuration');
    }
    const level = config.get('logger.level');
    return createLogger({
      level,
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
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
