const mongodb = require('mongodb')

const getDB = require('../../config/dbconfig/MongoDB').getDB

module.exports = class Product {
  getAll() {
    return getDB().collection('products').find().toArray()
  }

  get(id) {
    return getDB().collection('products').findOne({ _id: new mongodb.ObjectId(id) })
  }

  save(product) {
    return getDB().collection('products').insertOne(product)
  }

  update(product, id) {
    return getDB().collection('products').updateOne({ _id: new mongodb.ObjectId(id) }, { $set: product })
  }

  delete(id) {
    return getDB().collection('products').deleteOne({ _id: new mongodb.ObjectId(id) })
  }
}
