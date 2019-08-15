const Product = require('../models/FileDB/Product')

exports.getProducts = async (req, res) => {
  const product = new Product()
  try {
    data = await product.getAll()
    return res.send(data)
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.getProduct = async (req, res) => {
  const product = new Product()
  try {
    data = await product.get(parseInt(req.params.id))
    return res.send((data) ? data : "No product found!")
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.addProduct = (req, res) => {
  const product = new Product()
  const body = []
  try {
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      data = await product.save(parsedBody)
      return res.send(data)
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.updateProduct = (req, res) => {
  const product = new Product()
  const body = []
  try {
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      data = await product.update(parsedBody, parseInt(req.params.id))
      return res.send(data)
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.deleteProduct = async (req, res) => {
  const product = new Product()
  try {
    data = await product.delete(parseInt(req.params.id))
    return res.send(data)
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}
