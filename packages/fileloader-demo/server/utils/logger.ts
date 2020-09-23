import winston from 'winston';
import path from 'path'

export const LOG_DIR= path.join(__dirname, '../logs')

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
		//
		// - Write all logs with level `error` and below to `error.log`
		// - Write all logs with level `info` and below to `combined.log`
		//
		new winston.transports.File({ filename: path.join(LOG_DIR, 'error.log'), level: 'error' }),
		new winston.transports.File({ filename: path.join(LOG_DIR, 'combined.log') })
	]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple()
		})
	);
}
