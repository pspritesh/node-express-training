const MongoClient = require('mongodb').MongoClient

let _db;

const mongoConnect = async callback => {
  try {
    const result = await MongoClient.connect(process.env.DB_URL+process.env.DB_NAME, { useNewUrlParser: true })
    _db = result.db()
    callback()
  } catch (error) {
    console.log(error)
  }
}

const getDB = () => (_db) ? _db : 'No database found!'

exports.mongoConnect = mongoConnect
exports.getDB = getDB
