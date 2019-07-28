const Product = require('../models/Sequelize/Product');
const User = require('../models/Sequelize/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    data = []
    users.forEach(async user => {
      const profiles = await user.getProfile()
      data.push({
        id: user.id,
        profile: (profiles) ? profiles.dataValues : {},
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })
    })
    setTimeout(() => res.send(data), 5000)
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findAll({where: {id: parseInt(req.params.id)}})
    if (user.length) {
      const profiles = await user[0].getProfile()
      const userData = {
        id: user[0].id,
        profile: (profiles) ? profiles : {},
        username: user[0].username,
        email: user[0].email,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt
      }
      res.send(userData)
    } else {
      return res.status(404).send('No users found!')
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      const user = await User.create({
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password
      })
      if (user) {
        const profile = await user.createProfile({
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        })
        return res.status(profile ? 200 : 404).send(profile ? 'User added successfully!' : 'Could not create profile for user!')
      } else {
        return res.status(404).send('Could not create user!')
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      // const user = await User.update(
      //   {
      //     username: parsedBody.username,
      //     email: parsedBody.email,
      //     password: parsedBody.password
      //   },
      //   {
      //     where: {id: parseInt(req.params.id)}
      //   }
      // )
      const user = await User.findAll({where: {id: parseInt(req.params.id)}})
      if (user) {
        user[0].username = parsedBody.username
        user[0].email = parsedBody.email
        user[0].password = parsedBody.password
        user[0].save()
        const profile = await user[0].getProfile()
        if (profile) {
          profile.fname = parsedBody.fname
          profile.mname = parsedBody.mname
          profile.lname = parsedBody.lname
          profile.save()
        } else {
          profile = await user.createProfile({
            fname: parsedBody.fname,
            mname: parsedBody.mname,
            lname: parsedBody.lname
          })
        }
        return res.status(profile ? 200 : 404).send(profile ? 'User updated successfully!' : 'Could not update profile of user!')
      } else {
        return res.status(404).send('Could not update user!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  try {
    // const user = await User.destroy({where: {id: parseInt(req.params.id)}})
    const user = await User.findAll({where: {id: parseInt(req.params.id)}})
    if (user[0]) {
      const profile = await user[0].getProfile()
      if (profile) {
        profile.destroy()
      }
      user[0].destroy()
      return res.send('User deleted successfully!')
    } else {
      return res.status(404).send('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}

exports.getProduct = async (req, res) => {
  try {
    const user = await User.findAll({where: {id: parseInt(req.params.id)}})
    if (user.length) {
      const products = await user[0].getProducts()
      return res.status(products.length ? 200 : 404).send(products.length ? products : 'No products found!')
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
    const user = await User.findAll({where: {id: parseInt(req.params.id)}})
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const productData = JSON.parse(Buffer.concat(body).toString()).data
      if (user.length) {
        const product = await user[0].createProduct({
          name: productData.name,
          price: productData.price,
          description: productData.description,
        })
        return res.status(product ? 200 : 404).send(product ? 'Product created successfully!' : 'Could not create product for user!')
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
    const user = await User.findAll({where: {id: parseInt(req.params.uid)}})
    if (user.length) {
      const product = await Product.findAll({where: {id: parseInt(req.params.pid)}})
      if (product.length) {
        data = await user[0].addProduct(product[0])
        return res.status(data ? 200 : 404).send(data ? 'Product assigned successfully!' : 'Could not assign product for user!')
      } else {
        return res.status(404).send('No product found!')
      }
    } else {
      return res.status(404).send('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send("Something went wrong!")
  }
}
