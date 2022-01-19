const { dbCollectionName } = require('./config');

module.exports = (app, dbClient) => {
  app.post('/register', async (req, res) => {
    const userName = req.body.userName;

    if (userName) {
      await dbClient.collection(dbCollectionName).insertOne({userName});
      res.status(200).send({status: 'INSERTED'});
    } else {
      res.status(400).send({status: 'MISSING_FIELDS'});
    }
  });
};