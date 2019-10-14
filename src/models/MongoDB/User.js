const mongodb = require('mongodb')

const getDB = require('../../config/dbconfig/MongoDB').getDB

module.exports = class User {
  getAll() {
    const db = getDB()
    return db.collection('users').find().toArray()
  }

  get(id) {
    const db = getDB()
    // return db.collection('users').find({_id: new mongodb.ObjectId(id)}).next()
    return db.collection('users').findOne({_id: new mongodb.ObjectId(id)})
  }

  getByName(name) {
    const db = getDB()
    return db.collection('users').findOne({name: name})
  }

  save(user) {
    const db = getDB()
    // return db.collection('users').insertOne(user).then(result => result).catch(err => console.log(err))
    return db.collection('users').insertOne(user)
  }

  update(user, id) {
    const db = getDB()
    // return db.collection('users').updateOne({_id: new mongodb.ObjectId(id)}, {$set: user}).then(result => result).catch(err => console.log(err))
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(id)}, {$set: user})
  }

  delete(id) {
    const db = getDB()
    // return db.collection('users').deleteOne({_id: new mongodb.ObjectId(id)}).then(result => result).catch(err => console.log(err))
    return db.collection('users').deleteOne({_id: new mongodb.ObjectId(id)})
  }

  getProducts(productIds) {
    const db = getDB()
    return db.collection('products').find({_id: {$in: productIds}}).toArray()
  }

  findByProduct(productId) {
    const db = getDB()
    return db.collection('users').find({products: new mongodb.ObjectId(productId)}).toArray()
  }
}
