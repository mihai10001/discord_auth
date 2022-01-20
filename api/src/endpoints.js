const { dbCollectionName, discordBotToken, discordGuildId } = require('./config');
const { Client, Intents } = require('discord.js');
const sanitize = require('mongo-sanitize');


module.exports = (app, dbClient) => {
  app.post('/register', async (req, res) => {
    const userId = sanitize(req.body.userId);
    const userName = sanitize(req.body.userName);
    const userDiscriminator = sanitize(req.body.userDiscriminator);
    const wallet = sanitize(req.body.wallet);

    try {
      await validateData(userId, userName, userDiscriminator, wallet, dbClient);
    } catch (error) {
      res.status(400).send({ status: 'INVALID_DATA: ' + error });
    }
  });
};

async function validateData(userId, userName, userDiscriminator, wallet, dbClient) {
  if (!userId || !userName || !userDiscriminator || !wallet) throw 'MISSING FIELDS';
}
