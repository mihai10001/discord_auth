const { dbCollectionName, clientId, clientSecret, clientRedirect, discordBotToken, discordGuildId } = require('./config');
const { Client, Intents } = require('discord.js');
const sanitize = require('mongo-sanitize');
const fetch = require('node-fetch');

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

  const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] });
  await client.login(discordBotToken);
  const list = client.guilds.cache.get(discordGuildId);
  const members = await list.members.fetch();
  const member = members.find(member => member.user.id === userId);

  if (member) {
    const user = member.user;
    if (user.id === userId && user.username === userName && user.discriminator === userDiscriminator) {
      await dbClient.collection(dbCollectionName).insertOne({ userId, userName, userDiscriminator, wallet, createdOn: new Date() });
    } else throw 'INCONSISTENT DATA';
  } else throw 'MEMBER IS NOT IN SERVER';
}
