const { dbCollectionName } = require('./config');
const sanitize = require('mongo-sanitize');


module.exports = (app, dbClient) => {
  app.post('/register', async (req, res) => {
    const userId = sanitize(req.body.userId);
    const userName = sanitize(req.body.userName);
    const userDiscriminator = sanitize(req.body.userDiscriminator);
    const wallet = sanitize(req.body.wallet);

    if (userName) {
      await dbClient.collection(dbCollectionName).insertOne({userName});
      res.status(200).send({status: 'INSERTED'});
    } else {
      res.status(400).send({status: 'MISSING_FIELDS'});
    }
  });
};