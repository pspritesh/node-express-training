const mongodb = require('mongodb')

const getDB = require('../../config/dbconfig/MongoDB').getDB

module.exports = class Product {
  getAll() {
    const db = getDB()
    return db.collection('products').find().toArray()
  }

  get(id) {
    const db = getDB()
    return db.collection('products').findOne({_id: new mongodb.ObjectId(id)})
  }

  save(product) {
    const db = getDB()
    return db.collection('products').insertOne(product)
  }

  update(product, id) {
    const db = getDB()
    return db.collection('products').updateOne({_id: new mongodb.ObjectId(id)}, {$set: product})
  }

  delete(id) {
    const db = getDB()
    return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
  }

  getUser(id) {
    const db = getDB()
    return db.collection('users').find({_id: new mongodb.ObjectId(id)}).toArray()
  }
}
