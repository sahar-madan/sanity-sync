import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read a JSON file from the 'input' folder
const readJsonFile = (fileName: string): any | null => {
	const filePath = path.join(__dirname, `../../input/${fileName}`);

	try {
		return fs.readJsonSync(filePath);
	} catch (err) {
		const error = err as NodeJS.ErrnoException;

		if (error.code === 'ENOENT') {
			// Return null if the file is not found
			return null;
		}

		// Rethrow other errors
		throw new Error(`Error reading ${fileName}: ${error.message}`);
	}
};

// Expose specific JSON reading functions
export const readAddJson = () => readJsonFile('add.json');
export const readUpdateJson = () => readJsonFile('update.json');
export const readDeleteJson = () => readJsonFile('delete.json');
