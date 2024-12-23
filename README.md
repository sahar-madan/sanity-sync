
# Sanity Sync

A TypeScript library to Add, Update, and Delete Sanity dataset documents using JSON input files.

## Features

- Add documents to Sanity dataset
- Update documents in Sanity dataset (updating specific fields without replacing the whole document)
- Delete documents from Sanity dataset using document IDs
- Easy integration with Sanity API and management of dataset documents

## Installation
1. Clone the repository or download the project files.
2. Install dependencies  (using NPM)
3. Ensure that you have a valid Sanity project and dataset.
4. Create a `.env` file at the root of the project to store your Sanity configuration:
```
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=your_dataset_name
SANITY_TOKEN=your_sanity_token
```

## Usage

1. Add your Sanity project configuration to the `.env` file as shown above.
2. Ensure that your JSON files are structured correctly for adding, updating, or deleting documents.
3. The library expects three JSON files in the `input` folder (which should be gitignored):
4. `add.json`: A JSON file containing documents to add. Fields should contain all necessary data except for the `_id`, which will be auto-generated.
5. `update.json`: A JSON file containing documents to update. Use the `_id` field to specify which document to update. Only the fields provided will be updated (no replacements).
6. `delete.json`: A JSON file containing an array of document IDs to delete.
7. Run the following command to execute the script:

## Running

```npm start```

The script will:
- Add documents from `add.json`
- Update documents from `update.json`
- Delete documents based on IDs in `delete.json`

## Logging

Logs are written to both the console and a file (`logs/app.log`).
Different log levels:
-  `INFO`: General informational messages (blue).
-  `SUCCESS`: Indicates successful operations (green).
-  `ERROR`: For errors (red).
-  `WARNING`: For warnings (yellow).
-  `DEBUG`: Debug messages (magenta).
-  `GENERAL`: Generic messages (white).


## Example JSON File Structure

1.  `add.json` (Add documents):

```json
[{
	"title": "New Document",
	"content": "This is a newly added document"
}]
```

2.  `update.json` (Update documents):

```json
[{
	"_id": [Document ID],
	"content": "This is a newly added document"
}]
```
OR

```json
{
	"_id": [Document ID],
	"content": "This is a newly added document"
}
```

3.  `delete.json` (Delete documents):

```json
[
	[Document ID 1],
	[Document ID 2]
]
```

## License

MIT License. See LICENSE file for details.
