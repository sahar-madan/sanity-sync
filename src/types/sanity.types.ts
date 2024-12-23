export interface SanityCreateDocument {
	_type: string;
	[key: string]: any;
}

export interface SanityUpdateById {
	_id: string;
	_type: string;
}

export interface SanityUpdateByQuery {
	query: string;
	params?: Record<string, any>;
	onlyIfMissing?: boolean;
	update?: Record<string, any>;
	delete?: string[];
}

export type SanityUpdateDocument = SanityUpdateById[] | SanityUpdateByQuery;

export type SanityDeleteDocument = string;
