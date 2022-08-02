const MongoClient = require("mongodb").MongoClient;

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
const dbName = "remarkaboDB";

let db;

exports.connect = (callback) => {
  client.connect((err, client) => {
    db = client.db(dbName);
    return callback(err, client);
  });
};

exports.getDb = () => db;
