const Product = require('../models/FileDB/Product');

exports.getProducts = async (req, res) => {
  const product = new Product();
  try {
    data = await product.getAll();
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.json('Something went wrong!');
  }
}

exports.getProduct = async (req, res) => {
  const product = new Product();
  try {
    data = await product.get(parseInt(req.params.id));
    return res.json((data) ? data : 'No product found!');
  } catch (error) {
    console.error(error);
    return res.json('Something went wrong!');
  }
}

exports.addProduct = async (req, res) => {
  const product = new Product();
  try {
    data = await product.save(req.body);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.json('Something went wrong!');
  }
}

exports.updateProduct = async (req, res) => {
  const product = new Product();
  try {
    data = await product.update(req.body, parseInt(req.params.id));
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.json('Something went wrong!');
  }
}

exports.deleteProduct = async (req, res) => {
  const product = new Product();
  try {
    data = await product.delete(parseInt(req.params.id));
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.json('Something went wrong!');
  }
}
