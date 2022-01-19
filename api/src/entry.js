const express = require('express');
const cors = require('cors');
const dbUtils = require('./dbUtils');
const endpoints = require('./endpoints');
// const corsOptions = { origin: 'http://localhost:4200' };

const app = express();
const port = process.env.PORT || 8123;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

dbUtils.connectToMongo()
  .then(db => {
    endpoints(app, db);
    app.listen(port, () => console.log('App started on port: ' + port));
  });