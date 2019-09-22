const bcrypt = require('bcrypt')

const mailer = require('../config/mailer')
const Product = require('../models/MongoDB/Product')
const User = require('../models/MongoDB/User')

exports.getUsers = async (req, res) => {
  try {
    const user = new User()
    const data = await user.getAll()
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
    const user = new User()
    const data = await user.get(req.params.id)
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
    const user = new User()
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const hashedPassword = await bcrypt.hash(parsedBody.password, 256)
      let userData = {
        profile: {
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        },
        username: parsedBody.username,
        email: parsedBody.email,
        password: hashedPassword,
        apiToken: randomstring.generate()
      }
      const data = await user.save(userData)
      if (data.insertedCount) {
        mailer.sendMail(
          parsedBody.email,
          'psp@sendgrid.com',
          'Node App Signin',
          `<p>
            Hi ${parsedBody.fname},<br>
            Your account has been created successfully.<br>
            Please find your credentials mentioned below :<br>
            Username: ${parsedBody.username}<br>
            Password: ${parsedBody.password}<br>
            Thank you for joining us. Good luck.<br>
          </p>`
        ).then(() => console.log("Email sent successfully!")).catch(err => console.error(err))
        return res.status(201).send('User added successfully!')
      } else {
        return res.status(404).send('Could not create profile for user!')
      }
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const hashedPassword = await bcrypt.hash(parsedBody.password, 256)
      let userData = {
        profile: {
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        },
        username: parsedBody.username,
        email: parsedBody.email,
        password: hashedPassword,
        apiToken: randomstring.generate()
      }
      const data = await user.update(userData, req.params.id)
      if (data.modifiedCount) {
        return res.status(201).send('User updated successfully!')
      } else {
        return res.status(404).send('User not updated!')
      }
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
    if (data.deletedCount) {
      return res.send('User deleted successfully!')
    } else {
      return res.status(404).send('User not deleted!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const product = new Product()
    const data = await product.getAll()
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
    const user = new User()
    const userData = await user.get(req.params.id)
    if (userData) {
      if (userData.products) {
        const productData = await user.getProducts(userData.products)
        if (productData.length) {
          return res.send(productData)
        } else {
          return res.status(404).send('Product not found!')
        }
      } else {
        return res.status(404).send('No products assigned to users!')
      }
    } else {
      return res.status(404).send('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.createProduct = async (req, res) => {
  try {
    const product = new Product()
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const data = await product.save(parsedBody)
      if (data.insertedCount) {
        return res.status(201).send('Product added successfully!')
      } else {
        return res.status(404).send('Something went wrong!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const product = new Product()
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const data = await product.update(parsedBody, req.params.id)
      if (data.modifiedCount) {
        return res.status(201).send('Product updated successfully!')
      } else {
        return res.status(201).send('Product not updated!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    const user = new User()
    const oldUserData = await user.get(req.params.id)
    if (oldUserData) {
      const body = []
      req.on('data', chunk => {
        body.push(chunk)
      })
      req.on('end', async () => {
        const parsedBody = JSON.parse(Buffer.concat(body).toString())
        const product = new Product()
        const productData = await product.save(parsedBody)
        if (oldUserData.products) {
          oldUserData.products.push(productData.insertedId)
        } else {
          oldUserData.products = [productData.insertedId]
        }
        const updatedUserData = await user.update(oldUserData, req.params.id)
        if (productData.insertedCount && updatedUserData.modifiedCount) {
          return res.status(201).send('Product added and assigned to user successfully!')
        } else {
          return res.status(404).send('Could not assign product for user!')
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
        if (userUpdateData.modifiedCount) {
          return res.status(201).send('Product assigned successfully!')
        } else {
          return res.status(404).send('Could not assign product for user!')
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
    const product = new Product()
    const productData = await product.get(req.params.id)
    if (productData) {
      const user = new User()
      const userData = await user.findByProduct(req.params.id)
      const data = await product.delete(req.params.id)
      if (data.deletedCount && userData.length) {
        userData.forEach(async eachUser => {
          newProducts = (eachUser.products).filter(product => product.toString() !== productData._id.toString())
          eachUser.products = newProducts
          await user.update(eachUser, eachUser._id)
        })
        res.send("Product deleted and cascaded successfully!")
      } else {
        res.send("Product deleted successfully!")
      }
    } else {
      res.status(404).send("No product to delete!")
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}
