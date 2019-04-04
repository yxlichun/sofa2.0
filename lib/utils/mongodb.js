const printer = require('./printer');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://10.188.40.14:27017/';

const DbOperate = {};

DbOperate.connect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  })
}

DbOperate.insertLog = (data) => {
  return new Promise((resolve, reject) => {
    DbOperate.connect().then(db => {
      const dbo = db.db('sofa');
      const log = {
        ...data,
        time: new Date(),
      }
      dbo.collection('logs').insertOne(log, function(err, res) {
        if (err) {
          reject(err);
          return;
        };
        printer.success('insert log success');
        db.close();
        resolve(true);
      });
    })
  })
}

module.exports = DbOperate;

