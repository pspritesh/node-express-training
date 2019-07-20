const User = require('../models/Sequelize/User');

exports.getUsers = async (req, res) => {
  try {
    var allUsers = [];
    users = await User.findAll()
    users.forEach(async user => {
      const profiles = await user.getProfile()
      var profile = {}
      if (profiles) {
        profile = profiles
      }
      const userData = {
        id: user.id,
        profile: profile,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
      allUsers.push(userData)
    })
    return res.send(allUsers)
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  try {
    user = await User.findAll({where: {id: parseInt(req.params.id)}})
    if (user.length) {
      const profiles = await user[0].getProfile()
      var profile = {}
      if (profiles) {
        profile = profiles
      }
      const userData = {
        id: user[0].id,
        profile: profile,
        username: user[0].username,
        email: user[0].email,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt
      }
      res.send(userData)
    } else {
      return res.send('No users found!')
    }
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
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
      var user = await User.create({
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password
      })
      if (user) {
        var profile = await user.createProfile({
          fname: parsedBody.fname,
          mname: parsedBody.mname,
          lname: parsedBody.lname
        })
        return res.send(profile ? 'User added successfully!' : 'Could not create profile for user!')
      } else {
        return res.send('Could not create user!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
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
      // var user = await User.update(
      //   {
      //     username: parsedBody.username,
      //     email: parsedBody.email,
      //     password: parsedBody.password
      //   },
      //   {
      //     where: {id: parseInt(req.params.id)}
      //   }
      // )
      var user = await User.findAll({where: {id: parseInt(req.params.id)}})
      if (user) {
        user[0].username = parsedBody.username
        user[0].email = parsedBody.email
        user[0].password = parsedBody.password
        user[0].save()
        var profile = await user[0].getProfile()
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
        return res.send(profile ? 'User updated successfully!' : 'Could not update profile of user!')
      } else {
        return res.send('Could not update user!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  try {
    // user = await User.destroy({where: {id: parseInt(req.params.id)}})
    user = await User.findAll({where: {id: parseInt(req.params.id)}})
    if (user) {
      profile = await user[0].getProfile()
      if (profile) {
        profile.destroy()
      }
      user[0].destroy()
      return res.send('User deleted successfully!')
    } else {
      return res.send('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.getProduct = async (req, res) => {
  try {
    user = await User.findAll({where: {id: parseInt(req.params.id)}})
    if (user.length) {
      const products = await user[0].getProducts()
      return res.send(products.length ? products : 'No products found!')
    } else {
      return res.send('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.addProduct = async (req, res) => {
  try {
    const user = await User.findAll({where: {id: parseInt(req.params.id)}})
    const body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const productData = JSON.parse(Buffer.concat(body).toString()).data
      if (user.length) {
        var product = await user[0].createProduct({
          name: productData.name,
          price: productData.price,
          description: productData.description,
        })
        return res.send(product ? 'Product assigned successfully!' : 'Could not assign product for user!')
      } else {
        return res.send('User not found!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}