import sanityClient from '@sanity/client';
import { log } from 'src/utils/logger';

import sanityConfig from '../config/sanity.config';

// Initialize the Sanity client
const client = sanityClient({
	projectId: sanityConfig.projectId,
	dataset: sanityConfig.dataset,
	token: sanityConfig.token,
	apiVersion: sanityConfig.apiVersion,
	useCdn: false,
});

/**
 * Generic function to process documents with async operations.
 * @param items - Array of items to process.
 * @param operation - Async function to handle each item.
 * @param operationName - Name of the operation for logging.
 */
const processItems = async <T>(
	items: T[],
	operation: (item: T) => Promise<void>,
	operationName: string
): Promise<void> => {
	for (const item of items) {
		try {
			await operation(item);
			log.success(`Document ${operationName} successfully.`);
		} catch (err) {
			const error = err as Error;
			log.error(`Error during ${operationName} operation:`, { message: error.message });
		}
	}
};

/**
 * Add new documents to Sanity.
 * @param docs - Array of documents to add.
 */
export const addDocuments = async (docs: any[]): Promise<void> => {
	await processItems(
		docs,
		async (doc) => {
			const createdDoc = await client.create(doc);
			log.success(`Document added: ${createdDoc._id}`);
		},
		'add'
	);
};

/**
 * Update existing documents in Sanity.
 * @param docs - Array of documents to update.
 */
export const updateDocuments = async (docs: any[]): Promise<void> => {
	await processItems(
		docs,
		async (doc) => {
			if (!doc._id) {
				throw new Error('Document must have an _id for updates.');
			}
			const updatedDoc = await client.patch(doc._id).set(doc).commit();
			log.success(`Document updated: ${updatedDoc._id}`);
		},
		'update'
	);
};

/**
 * Delete documents from Sanity.
 * @param ids - Array of document IDs to delete.
 */
export const deleteDocuments = async (ids: string[]): Promise<void> => {
	await processItems(
		ids,
		async (id) => {
			await client.delete(id);
			log.success(`Document deleted: ${id}`);
		},
		'delete'
	);
};
