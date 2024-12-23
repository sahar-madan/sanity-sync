import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Destructure environment variables with default values where applicable
const {
	SANITY_PROJECT_ID,
	SANITY_DATASET,
	SANITY_TOKEN,
	SANITY_API_VERSION = '2022-03-07',
} = process.env;

// Sanity configuration object
const sanityConfig = {
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	token: SANITY_TOKEN,
	apiVersion: SANITY_API_VERSION,
};

// Check if required environment variables are missing
if (!sanityConfig.projectId || !sanityConfig.dataset || !sanityConfig.token) {
	throw new Error(
		'Sanity configuration is missing required environment variables: ' +
			'SANITY_PROJECT_ID, SANITY_DATASET, or SANITY_TOKEN'
	);
}

export default sanityConfig;
