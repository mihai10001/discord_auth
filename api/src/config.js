const dotenv = require('dotenv');
dotenv.config();

const dbUri = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const dbCollectionName = process.env.DB_COLLECTION_NAME;
const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordGuildId = process.env.DISCORD_GUILD_ID;

module.exports = { dbUri, dbName, dbCollectionName, discordBotToken, discordGuildId };