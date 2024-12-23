import sanityClient from '@sanity/client';

import sanityConfig from '../config/sanity.config';
import { OperationData } from '../types/operation.types';
import {
	SanityCreateDocument,
	SanityDeleteDocument,
	SanityUpdateById,
	SanityUpdateDocument,
} from '../types/sanity.types';
import { log } from '../utils/logger';

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
 */
const processItems = async <T>(items: T[], operation: OperationData<T>): Promise<void> => {
	for (const [index, item] of items.entries()) {
		await operation(item, index);
	}
};

/**
 * Handle errors and log results.
 * @param operation - Promise-based operation to execute.
 * @param successMessage - Message to log on success.
 * @param errorMessage - Message to log on error.
 * @param index - Index of the current item.
 * @param extraData - Additional data to log.
 */
const handleOperation = async (
	operation: () => Promise<any>,
	successMessage: string,
	errorMessage: string,
	index: number,
	extraData: Record<string, any> = {}
): Promise<void> => {
	try {
		const result = await operation();
		log.success(successMessage, { ...extraData, index, result });
	} catch (err: any) {
		log.error(errorMessage, { message: err.message, index, ...extraData });
	}
};

/**
 * Add new documents to Sanity.
 * @param docs - Array of documents to add.
 */
export const addDocuments = async (docs: SanityCreateDocument[]): Promise<void> => {
	await processItems(docs, async (doc, index) => {
		if (!doc._type) {
			log.error('Unable to create Document', {
				message: 'Document must have a _type field',
				index,
			});
			return;
		}

		await handleOperation(
			() => client.transaction().create(doc).commit(),
			'Document created',
			'Unable to create Document',
			index
		);
	});
};

/**
 * Update existing documents in Sanity.
 * @param obj - Sanity update object (array or query-configured data).
 */
export const updateDocuments = async (obj: SanityUpdateDocument): Promise<void> => {
	const updateDocument = async (
		doc: SanityUpdateById,
		index: number,
		updateData: {
			set?: Record<string, any>;
			setIfMissing?: Record<string, any>;
			unset?: string[];
		}
	): Promise<void> => {
		if (!doc._id) {
			log.error('Unable to update Document', {
				message: 'Document must have a _id field',
				index,
			});
			return;
		}

		await handleOperation(
			() =>
				client
					.patch(doc._id)
					.set(updateData.set || {})
					.setIfMissing(updateData.setIfMissing || {})
					.unset(updateData.unset || [])
					.commit(),
			'Document updated',
			'Unable to update Document',
			index
		);
	};

	if (Array.isArray(obj)) {
		await processItems(obj, (doc, index) => updateDocument(doc, index, { set: doc }));
	} else {
		const fetchedDocs = (await client.fetch(obj.query, obj.params || {})) as SanityUpdateById[];

		if (!fetchedDocs.length) {
			log.error('No documents found to update based on the query', {
				query: obj.query,
				params: obj.params || {},
			});
			return;
		}

		await processItems(fetchedDocs, (doc, index) =>
			updateDocument(doc, index, {
				set: obj.update,
				setIfMissing: obj.onlyIfMissing ? obj.update : {},
				unset: obj.delete || [],
			})
		);
	}
};

/**
 * Delete documents from Sanity.
 * @param ids - Array of document IDs to delete.
 */
export const deleteDocuments = async (ids: SanityDeleteDocument[]): Promise<void> => {
	await processItems(ids, async (id, index) => {
		await handleOperation(
			() => client.delete(id),
			'Document deleted',
			'Unable to delete Document',
			index
		);
	});
};
