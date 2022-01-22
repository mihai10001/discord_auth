const dotenv = require('dotenv');
dotenv.config();

const dbUri = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const dbCollectionName = process.env.DB_COLLECTION_NAME;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientRedirect = process.env.CLIENT_REDIRECT;

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordGuildId = process.env.DISCORD_GUILD_ID;

module.exports = { dbUri, dbName, dbCollectionName, clientId, clientSecret, clientRedirect, discordBotToken, discordGuildId };