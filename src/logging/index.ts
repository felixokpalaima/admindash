import { default as pino } from 'pino';

const getLogger = (level: string) =>
  pino({
    level: level || 'debug',
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: ['email']
    }
  });

export default getLogger;
