const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { connect } = require('./utils/dbConnection');

const app = express();
const port = process.env.PORT || 3001;;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to Database
connect((err, client) => {
  if (err) {
    console.log(err);
  }
});

// Routes
app.use('/', routes);
// Handle Error
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});