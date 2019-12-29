const mongodb = require('mongodb');

const getDB = require('../../config/dbconfig/MongoDB').getDB;

module.exports = class User {
  getAll() {
    return getDB().collection('users').find().toArray();
  }

  get(id) {
    return getDB().collection('users').findOne({ _id: new mongodb.ObjectId(id) });
  }

  getByName(name) {
    return getDB().collection('users').findOne({ name: name });
  }

  save(user) {
    return getDB().collection('users').insertOne(user);
  }

  update(user, id) {
    return getDB().collection('users').updateOne({ _id: new mongodb.ObjectId(id) }, { $set: user });
  }

  delete(id) {
    return getDB().collection('users').deleteOne({ _id: new mongodb.ObjectId(id) });
  }

  getProducts(productIds) {
    return getDB().collection('products').find({ _id: { $in: productIds } }).toArray();
  }

  findByProduct(productId) {
    return getDB().collection('users').find({ products: new mongodb.ObjectId(productId) }).toArray();
  }
}
