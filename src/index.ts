import { addDocuments, deleteDocuments, updateDocuments } from './services/document-service';
import { readAddJson, readDeleteJson, readUpdateJson } from './services/json-service';
import { log } from './utils/logger';

/**
 * Handles processing for a specific type of operation.
 * @param operationName - The name of the operation (e.g., "add", "update", "delete").
 * @param readFn - The function to read JSON data.
 * @param processFn - The function to process documents.
 */
const handleOperation = async (
	operationName: string,
	readFn: () => Record<string, any>[],
	processFn: (docs: any[]) => Promise<void>
): Promise<void> => {
	try {
		const document = readFn();
		if (document) await processFn(document);
		else log.info(`No documents to ${operationName}.`);
	} catch (err) {
		const error = err as Error;
		throw new Error(`Error processing ${operationName} documents: ${error.message}`);
	}
};

/**
 * Processes all document operations: add, update, delete.
 */
const processDocuments = async (): Promise<void> => {
	await Promise.all([
		handleOperation('add', readAddJson, addDocuments),
		handleOperation('update', readUpdateJson, updateDocuments),
		handleOperation('delete', readDeleteJson, deleteDocuments),
	]);
};

// Run the script
processDocuments().catch((err) => {
	throw new Error(`Unhandled error: ${err.message}`);
});
