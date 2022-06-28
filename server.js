const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const { logger } = require('./utils/logger');
const dotenv = require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3001;;

// Connection URL
const url = process.env.MONGODB_URL;
// Database Name
const dbName = 'remarkaboDB';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to Database
MongoClient.connect(url, (err, client) => {
  const db = client.db(dbName);
  const notesCollection = db.collection('notes');
  app.locals.notesCollection = notesCollection;
});

// Routes
app.use('/', routes);
// Handle Error
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});