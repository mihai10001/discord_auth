const { dbCollectionName, clientId, clientSecret, clientRedirect, discordBotToken, discordGuildId } = require('./config');
const { Client, Intents } = require('discord.js');
const sanitize = require('mongo-sanitize');
const fetch = require('node-fetch');

module.exports = (app, dbClient) => {
  app.post('/register', async (req, res) => {
    const code = sanitize(req.body.code);
    const wallet = sanitize(req.body.wallet);

    try {
      const oauthData = await authenticateUser(code);
      if (oauthData.error === 'invalid_request') throw 'INVALID REQUEST';

      const userData = await getUserInformation(oauthData);
      if (userData.message === '401: Unauthorized') throw 'UNAUTHORIZED';

      const isServerMember = await isUserInServer(userData);
      if (isServerMember) await insertUserEntry(userData, wallet, dbClient);

      res.status(200).send({ userName: userData.username });
    } catch (error) {
      res.status(400).send({ status: 'INVALID_DATA: ' + error });
    }
  });
};

async function authenticateUser(code) {
  if (!code) throw 'MISSING FIELDS';

  const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: clientRedirect,
      scope: 'identify',
      grant_type: 'authorization_code'
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return oauthResult.json();
}

async function getUserInformation(oauthData) {
  if (!oauthData) throw 'MISSING FIELDS';

  const userData = await fetch('https://discord.com/api/users/@me', {
	  headers: { authorization: `${oauthData.token_type} ${oauthData.access_token}` },
  });

  return userData.json();
}

async function isUserInServer(userData) {
  if (!userData) throw 'MISSING FIELDS';

  const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] });
  await client.login(discordBotToken);
  const list = client.guilds.cache.get(discordGuildId);
  const members = await list.members.fetch();
  const roles = await list.roles.fetch();
  const member = members.find(member => member.user.id === userData.id);

  if (member) {
    const user = member.user;
    if (user.id === userData.id && user.username === userData.username && user.discriminator === userData.discriminator) {
      userData.roles = member._roles.map(roleId => { if (roles.has(roleId)) return roles.get(roleId).name });
      return true;
    } else throw 'INCONSISTENT DATA';
  } else throw 'MEMBER IS NOT IN SERVER';
}

async function insertUserEntry(userData, wallet, dbClient) {
  if (!wallet) throw 'MISSING FIELDS';

  await dbClient
    .collection(dbCollectionName)
    .insertOne({
      userId: userData.id,
      userName: userData.username,
      userDiscriminator: userData.discriminator,
      userRoles: userData.roles,
      wallet,
      createdOn: new Date()
    });
}
