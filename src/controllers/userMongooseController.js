const User = require('../models/Mongoose/User')
const Product = require('../models/Mongoose/Product')

exports.getUsers = async (req, res) => {
  try {
    const data = await User.find()
    return res.status(data.length ? 200 : 404).send(data.length ? data : 'No users found!')
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id)
    return res.status(data ? 200 : 404).send(data ? data : 'User not found!')
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.addUser = async (req, res) => {
  try {
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      const data = await User.create({
        profile: {
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        },
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password
      })
      return res.status(data ? 200 : 404).send(data ? 'User added successfully!' : 'Something went wrong!')
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.updateUser = async (req, res) => {
  try {
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      const user = await User.findByIdAndUpdate(req.params.id, {
        profile: {
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        },
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password
      })
      return res.status(user ? 200 : 404).send(user ? 'User updated successfully!' : 'Nothing to update!')
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    return res.status(user ? 200 : 404).send(user ? 'User delete successfully!' : 'Nothing to delete!')
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const data = await Product.find()
    return res.status(data.length ? 200 : 404).send(data.length ? data : 'No products found!')
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getUserProducts = async (req, res) => {
  try {
    const userProducts = await User.findById(req.params.id).select('products -_id').populate('products')
    return res.status(userProducts ? 200 : 404).send(userProducts ? userProducts : 'Products not found!')
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.createProduct = async (req, res) => {
  try {
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      const data = await Product.create({
        name: parsedBody.name,
        price: parsedBody.price,
        description: parsedBody.description
      })
      return res.status(data ? 200 : 404).send(data ? 'Product added successfully!' : 'Something went wrong!')
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      const product = await Product.findByIdAndUpdate(req.params.id, {
        name: parsedBody.name,
        price: parsedBody.price,
        description: parsedBody.description
      })
      return res.status(product ? 200 : 404).send(product ? "Product updated successfully!" : 'Product not updated!')
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    const userData = await User.findById(req.params.id)
    if (userData) {
      const body = []
      req.on('data', chunk => {
        body.push(chunk)
      })
      req.on('end', async () => {
        const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
        const product = await Product.create({
          name: parsedBody.name,
          price: parsedBody.price,
          description: parsedBody.description
        })
        if (product) {
          userData.products.push(product)
          const user = await User.findByIdAndUpdate(req.params.id, userData)
          return res.status(user ? 200 : 404).send(user ? 'Product created and assigned to user successfully!' : 'Could not assign product to user!')
        } else {
          return res.status(404).send('Could not create product!')
        }
      })
    } else {
      return res.status(404).send('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.assignProduct = async (req, res) => {
  try {
    const user = await User.findById(req.params.uid)
    if (user) {
      const product = await Product.findById(req.params.pid)
      if (product) {
        user.products.push(product)
        /* Here to store all the raw data (without other metadata and other stuff) from this product, we can use _doc */
        // user.products.push(product._doc)
        const newUserData = await User.findByIdAndUpdate(req.params.uid, user)
        return res.status(newUserData ? 200 : 404).send(newUserData ? 'Product assigned successfully!' : 'Could not assign product to user!')
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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      const userData = await User.find()
      count = 0
      userData.forEach(async user => {
        if (user.products.length) {
          user.products = user.products.filter(productId => productId.toString() !== product._id.toString())
          const newUserData = await User.findByIdAndUpdate(user._id, user)
          if (newUserData) {
            count++
          }
        }
      })
      const deleteProduct = await Product.findByIdAndDelete(req.params.id)
      if (deleteProduct) {
        return res.send((count > 0) ? "Product deleted and cascaded successfully!" : "Product deleted successfully!")
      } else {
        return res.status(404).send("Unable to delete product!")
      }
    } else {
      return res.status(404).send("No product to delete!")
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}
