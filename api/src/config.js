const dotenv = require('dotenv');
dotenv.config();

const dbUri = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const dbCollectionName = process.env.DB_COLLECTION_NAME;

module.exports = { dbUri, dbName, dbCollectionName };