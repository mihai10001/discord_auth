const MongoClient = require('mongodb').MongoClient;
const { dbUri, dbName } = require('./config');

const connectToMongo = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbUri, { useNewUrlParser: true })
      .then(client => resolve(client.db(dbName)))
      .catch(err => reject(err));
  });
}

module.exports.connectToMongo = connectToMongo;