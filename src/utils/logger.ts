import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE_PATH = path.resolve(__dirname, '../../logs/app.log');

/**
 * Ensures the log file and its directory exist.
 */
const initializeLogFile = (): void => {
	if (!fs.existsSync(LOG_FILE_PATH)) {
		fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
		fs.writeFileSync(LOG_FILE_PATH, '=== Log Started ===\n', 'utf8');
	}
};

/**
 * Gets the current timestamp in ISO format (human-readable).
 */
const getTimestamp = (): string => new Date().toISOString().replace('T', ' ').split('.')[0];

/**
 * Serializes an object into a string for logging.
 * @param obj - The object to serialize.
 */
const formatObject = (obj: object): string =>
	Object.keys(obj).length > 0 ? ` | ${JSON.stringify(obj)}` : '';

/**
 * Writes a message to the log file.
 * @param message - The message to log.
 */
const logToFile = (message: string): void => {
	initializeLogFile();
	fs.appendFileSync(LOG_FILE_PATH, `${message}\n`, 'utf8');
};

/**
 * Logs a message with optional object data.
 * @param level - The log level (e.g., INFO, ERROR).
 * @param colorFn - Chalk function for coloring the output.
 * @param message - The main log message.
 * @param data - Additional key-value pairs to log.
 */
const logMessage = (
	level: string,
	colorFn: (text: string) => string,
	message: string,
	data: object = {}
): void => {
	const timestamp = getTimestamp();
	const formattedMessage = `${colorFn(`[${level}]`)} ${timestamp} - ${message}${formatObject(data)}`;

	console.log(formattedMessage);
	logToFile(formattedMessage);
};

// Public API for various log levels
export const log = {
	info: (message: string, data?: object) => logMessage('INFO', chalk.blue, message, data),

	success: (message: string, data?: object) => logMessage('SUCCESS', chalk.green, message, data),

	error: (message: string, data?: object) => logMessage('ERROR', chalk.red, message, data),

	warning: (message: string, data?: object) => logMessage('WARNING', chalk.yellow, message, data),

	debug: (message: string, data?: object) => logMessage('DEBUG', chalk.magenta, message, data),

	general: (message: string, data?: object) => logMessage('GENERAL', chalk.white, message, data),
};
