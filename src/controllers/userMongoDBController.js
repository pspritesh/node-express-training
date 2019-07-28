const User = require('../models/MongoDB/User');
const Product = require('../models/MongoDB/Product');

exports.getUsers = async (req, res) => {
  try {
    const user = new User()
    const data = await user.getAll()
    return res.status(data.length ? 200 : 404).send(data.length ? data : 'No users found!')
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = new User()
    const data = await user.get(req.params.id)
    return res.status(data ? 200 : 404).send(data ? data : 'User not found!')
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.addUser = async (req, res) => {
  try {
    const user = new User()
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      let userData = {
        profile: {
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        },
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password
      }
      const data = await user.save(userData)
      return res.status((data.insertedCount) ? 200 : 404).send((data.insertedCount) ? 'User added successfully!' : 'Something went wrong!')
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = new User()
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      let userData = {
        profile: {
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        },
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password
      }
      const data = await user.update(userData, req.params.id)
      return res.status((data.modifiedCount) ? 200 : 404).send((data.modifiedCount) ? "User updated successfully!" : 'User not updated!')
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = new User()
    const data = await user.delete(req.params.id)
    return res.status((data.deletedCount) ? 200 : 404).send((data.deletedCount) ? 'User deleted successfully!' : 'User not deleted!')
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getProducts = async (req, res) => {
  try {
    const user = new User()
    const userData = await user.get(req.params.id)
    if (userData) {
      const productData = await user.getProducts(userData.products)
      return res.status(productData.length ? 200 : 404).send(productData.length ? productData : 'Product not found!')
    } else {
      return res.status(404).send('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    const user = new User()
    const userData = await user.get(req.params.id)
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      if (userData) {
        const product = new Product()
        const productData = await product.save(parsedBody)
        if (userData.products) {
          userData.products.push(productData.insertedId)
        } else {
          userData.products = [productData.insertedId]
        }
        const userData = await user.update(userData, req.params.id)
        return res.status(
            (productData.insertedCount && userData.modifiedCount) ? 200 : 404
          ).send(
            (productData.insertedCount && userData.modifiedCount) 
              ? 'Product assigned successfully!' 
              : 'Could not assign product for user!'
          )
      } else {
        return res.status(404).send('User not found!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.assignProduct = async (req, res) => {
  try {
    const user = new User()
    const userData = await user.get(req.params.uid)
    if (userData) {
      const product = new Product()
      const productData = await product.get(req.params.pid)
      if (productData) {
        if (userData.products) {
          userData.products.push(productData._id)
        } else {
          userData.products = [productData._id]
        }
        const userUpdateData = await user.update(userData, req.params.uid)
        return res.status(
            (userUpdateData.modifiedCount) ? 200 : 404
          ).send(
            (userUpdateData.modifiedCount) 
            ? 'Product assigned successfully!' 
            : 'Could not assign product for user!'
          )
      } else {
        return res.status(404).send('Product not found!')
      }
    } else {
      return res.status(404).send('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}
