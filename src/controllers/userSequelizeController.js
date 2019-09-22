const bcrypt = require('bcrypt')
const datetime = require('node-datetime')
const randomstring = require('randomstring')

const mailer = require('../config/mailer')
const Product = require('../models/Sequelize/Product')
const User = require('../models/Sequelize/User')

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
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      const hashedPassword = await bcrypt.hash(parsedBody.password, 256)
      const user = await User.findAll({where: {username: parsedBody.username}})
      if (!user.length) {
        const user = await User.create({
          username: parsedBody.username,
          email: parsedBody.email,
          password: hashedPassword,
          api_token: randomstring.generate(),
          api_token_created_at: datetime.create().format('Y-m-d H:M:S')
        })
        if (user) {
          const profile = await user.createProfile({
            fname: parsedBody.fname,
            mname: parsedBody.mname,
            lname: parsedBody.lname
          })
          if (profile) {
            mailer.sendMail(
              parsedBody.email,
              process.env.EMAIL_FROM_ADDRESS,
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
        } else {
          return res.status(404).send('Could not create user!')
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
    const user = await User.findAll({where: {id: parseInt(req.params.id)}})
    if (user) {
      const body = []
      req.on('data', chunk => {
        body.push(chunk)
      })
      req.on('end', async () => {
        const parsedBody = JSON.parse(Buffer.concat(body).toString())
        const hashedPassword = await bcrypt.hash(parsedBody.password, 256)
        // const user = await User.update(
        //   {
        //     username: parsedBody.username,
        //     email: parsedBody.email,
        //     password: hashedPassword
        //   },
        //   {
        //     where: {id: parseInt(req.params.id)}
        //   }
        // )
        user[0].username = parsedBody.username
        user[0].email = parsedBody.email
        user[0].password = hashedPassword
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
        if (profile) {
          return res.status(201).send('User updated successfully!')
        } else {
          return res.status(404).send('Could not update profile of user!')
        }
      })
    } else {
      return res.status(404).send('Could not update user!')
    }
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
      if (products.length) {
        return res.send(products)
      } else {
        return res.status(404).send('No products found!')
      }
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
    if (user.length) {
      const body = []
      req.on('data', chunk => {
        body.push(chunk)
      })
      req.on('end', async () => {
        const productData = JSON.parse(Buffer.concat(body).toString())
        const product = await user[0].createProduct({
          name: productData.name,
          price: productData.price,
          description: productData.description,
        })
        if (product) {
          return res.status(201).send('Product created successfully!')
        } else {
          return res.status(404).send('Could not create product for user!')
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
    const user = await User.findAll({where: {id: parseInt(req.params.uid)}})
    if (user.length) {
      const product = await Product.findAll({where: {id: parseInt(req.params.pid)}})
      if (product.length) {
        data = await user[0].addProduct(product[0])
        if (data) {
          return res.status(201).send('Product assigned successfully!')
        } else {
          return res.status(404).send('Could not assign product for user!')
        }
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
