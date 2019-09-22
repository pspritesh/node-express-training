const bcrypt = require('bcrypt')
const randomstring = require("randomstring")

const mailer = require('../config/mailer')
const Product = require('../models/Mongoose/Product')
const User = require('../models/Mongoose/User')

exports.getUsers = async (req, res) => {
  try {
    const data = await User.find()
    if (data.length) {
      return res.send(data)
    } else {
      return res.status(404).send('No users found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id)
    if (data) {
      return res.send(data)
    } else {
      return res.status(404).send('User not found!')
    }
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const hashedPassword = await bcrypt.hash(parsedBody.password, 256)
      const data = await User.find({ username: parsedBody.username })
      if (!data.length) {
        const user = await User.create({
          profile: {
            fname: parsedBody.fname,
            mname: parsedBody.mname,
            lname: parsedBody.lname
          },
          username: parsedBody.username,
          email: parsedBody.email,
          password: hashedPassword,
          apiToken: randomstring.generate()
        })
        if (user) {
          mailer.sendMail(
            parsedBody.email,
            'psp@sendgrid.com',
            'Node App Signin',
            `<p>
              Hi ${parsedBody.fname},
              Your account has been created successfully.
              Please find your credentials mentioned below :
              Username: ${parsedBody.username}
              Password: ${parsedBody.password}
              Thank you for joining us. Good luck.
            </p>`
          ).then(() => console.log("Email sent successfully!")).catch(err => console.error(err))
          return res.status(201).send('User added successfully!')
        } else {
          return res.status(404).send('Something went wrong!')
        }
      } else {
        return res.status(404).send('Username is already taken, please choose a unique one!')
      }
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const hashedPassword = await bcrypt.hash(parsedBody.password, 256)
      const user = await User.findByIdAndUpdate(req.params.id, {
        profile: {
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        },
        username: parsedBody.username,
        email: parsedBody.email,
        password: hashedPassword,
        apiToken: randomstring.generate()
      }, {useFindAndModify: false})
      if (user) {
        return res.status(201).send('User updated successfully!')
      } else {
        return res.status(404).send('Nothing to update!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id, {useFindAndModify: false})
    if (user) {
      return res.send('User delete successfully!')
    } else {
      return res.status(404).send('Nothing to delete!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const data = await Product.find()
    if (data.length) {
      return res.send(data)
    } else {
      return res.status(404).send('No products found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getUserProducts = async (req, res) => {
  try {
    const userProducts = await User.findById(req.params.id).select('products -_id').populate('products')
    if (userProducts) {
      return res.send(userProducts)
    } else {
      return res.status(404).send('Products not found!')
    }
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const data = await Product.create({
        name: parsedBody.name,
        price: parsedBody.price,
        description: parsedBody.description
      })
      if (data) {
        return res.status(201).send('Product added successfully!')
      } else {
        return res.status(404).send('Could not add product!')
      }
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const product = await Product.findByIdAndUpdate(req.params.id, {
        name: parsedBody.name,
        price: parsedBody.price,
        description: parsedBody.description
      }, {useFindAndModify: false})
      if (product) {
        return res.status(201).send('Product updated successfully!')
      } else {
        return res.status(404).send('Product not updated!')
      }
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
        const parsedBody = JSON.parse(Buffer.concat(body).toString())
        const product = await Product.create({
          name: parsedBody.name,
          price: parsedBody.price,
          description: parsedBody.description
        })
        if (product) {
          userData.products.push(product)
          const user = await User.findByIdAndUpdate(req.params.id, userData, {useFindAndModify: false})
          if (user) {
            return res.status(201).send('Product created and assigned to user successfully!')
          } else {
            return res.status(404).send('Could not assign product to user!')
          }
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
        const newUserData = await User.findByIdAndUpdate(req.params.uid, user, {useFindAndModify: false})
        if (newUserData) {
          return res.status(201).send('Product assigned successfully!')
        } else {
          return res.status(404).send('Could not assign product to user!')
        }
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
          const newUserData = await User.findByIdAndUpdate(user._id, user, {useFindAndModify: false})
          if (newUserData) {
            count++
          }
        }
      })
      const deleteProduct = await Product.findByIdAndDelete(req.params.id, {useFindAndModify: false})
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
