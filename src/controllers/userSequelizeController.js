const bcrypt = require('bcrypt')
const datetime = require('node-datetime')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const randomstring = require('randomstring')

const mailer = require('../config/mailer')
const Product = require('../models/Sequelize/Product')
const Profile = require('../models/Sequelize/Profile')
const User = require('../models/Sequelize/User')

exports.getUsers = async (req, res) => {
  try {
    const itemsPerPage = 4
    const allUsers = await User.findAndCountAll()
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
      offset: ((req.query.page ? req.query.page : 1) - 1) * itemsPerPage,
      limit: itemsPerPage,
      include: [{
        model: Profile,
        attributes: ['fname', 'mname', 'lname']
      },
      {
        model: Product
      }]
    })
    return res.json({
      data: users,
      totalPages: Math.ceil(allUsers.count/itemsPerPage)
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
      where: { id: parseInt(req.params.id) },
      include: [{
        model: Profile,
        as: 'profile',
        attributes: ['fname', 'mname', 'lname']
      }]
    })
    if (user.length) {
      res.json(user)
    } else {
      return res.status(404).json('No users found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.addUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 256)
    const user = await User.findAll({ where: { username: req.body.username } })
    if (!user.length) {
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        api_token: randomstring.generate(),
        api_token_created_at: datetime.create().format('Y-m-d H:M:S')
      })
      if (user) {
        const profile = await user.createProfile({
          fname: req.body.fname,
          mname: req.body.mname,
          lname: req.body.lname
        })
        if (profile) {
          mailer.sendMail(
            req.body.email,
            process.env.EMAIL_FROM_ADDRESS,
            'Node App Signin',
            `<p>
              Hi ${req.body.fname},<br>
              Your account has been created successfully.<br>
              Please find your credentials mentioned below :<br>
              Username: ${req.body.username}<br>
              Password: ${req.body.password}<br>
              Thank you for joining us. Good luck.<br>
            </p>`
          ).then(() => console.log("Email sent successfully!")).catch(err => console.error(err))
          return res.status(201).json('User added successfully!')
        } else {
          return res.status(404).json('Could not create profile for user!')
        }
      } else {
        return res.status(404).json('Could not create user!')
      }
    } else {
      return res.status(404).json('Username is already taken, please choose a unique one!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findAll({ where: { id: parseInt(req.params.id) } })
    if (user) {
      const hashedPassword = await bcrypt.hash(req.body.password, 256)
        user[0].username = req.body.username
        user[0].email = req.body.email
        user[0].password = hashedPassword
        user[0].save()
        const profile = await user[0].getProfile()
        if (profile) {
          profile.fname = req.body.fname
          profile.mname = req.body.mname
          profile.lname = req.body.lname
          profile.save()
        } else {
          profile = await user.createProfile({
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname
          })
        }
        if (profile) {
          return res.status(201).json('User updated successfully!')
        } else {
          return res.status(404).json('Could not update profile of user!')
        }
    } else {
      return res.status(404).json('Could not update user!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findAll({ where: { id: parseInt(req.params.id) } })
    if (user[0]) {
      const profile = await user[0].getProfile()
      if (profile) {
        profile.destroy()
      }
      user[0].destroy()
      return res.json('User deleted successfully!')
    } else {
      return res.status(404).json('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const itemsPerPage = 4
    const allProducts = await Product.findAndCountAll()
    const products = await Product.findAll({ offset: ((req.query.page ? req.query.page : 1) - 1) * itemsPerPage, limit: itemsPerPage })
    return res.json({
      data: products,
      totalPages: Math.ceil(allProducts.count/itemsPerPage)
    })
    res.json(products)
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.getProduct = async (req, res) => {
  try {
    const userProducts = await User.findAll({
      where: { id: parseInt(req.params.id) },
      attributes: [],
      include: [Product]
    })
    if (userProducts.length) {
      return res.json(userProducts)
    } else {
      return res.status(404).json('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    })
    if (product) {
      return res.status(201).json('Product added successfully!')
    } else {
      return res.status(404).json('Could not create product!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.update(
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
      },
      {
        where: {id: parseInt(req.params.id)}
      }
    )
    if (product) {
      return res.status(201).json('Product updated successfully!')
    } else {
      return res.status(404).json('Could not update product!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.destroy({ where: { id: parseInt(req.params.id) } })
    if (product) {
      return res.json('Product deleted and cascaded successfully!')
    } else {
      return res.status(404).json('Product not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    const user = await User.findAll({ where: { id: parseInt(req.params.id) } })
    if (user.length) {
      const product = await user[0].createProduct({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      })
      if (product) {
        return res.status(201).json('Product created successfully!')
      } else {
        return res.status(404).json('Could not create product for user!')
      }
    } else {
      return res.status(404).json('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.addNewProductImage = async (req, res) => {
  try {
    const product = await Product.findAll({ where: { id: parseInt(req.params.id) } })
    if (product.length) {
      const productImage = req.file
      if (productImage) {
        product[0].image = productImage.path
        product[0].save()
        return res.status(201).json('Image assigned to product successfully!')
      } else {
        return res.status(404).json('No image found to upload!')
      }
    } else {
      return res.status(404).json('Product not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.getProductImage = async (req, res) => {
  try {
    const product = await Product.findAll({ where: { id: parseInt(req.params.id) } })
    if (product.length) {
      /**** Sending file path in response */
      // return res.status(200).json(product[0].image)

      /**** Reading the entire file to make it available for users */
      // fs.readFile(path.join(path.dirname(process.mainModule.filename), product[0].image), (err, data) => {
      //   if (err) {
      //     return res.status(404).json("File not found!")
      //   }
      //   res.setHeader('Content-Type', 'application/jpg')
      //   res.setHeader('Content-Disposition', `inline; filename=${product[0].image}`)
      //   return res.status(200).json(data)
      // })

      /**** Streaming the file for users */
      const file = fs.createReadStream(path.join(path.dirname(process.mainModule.filename), product[0].image))
      res.setHeader('Content-Type', 'application/jpg')
      res.setHeader('Content-Disposition', `inline; filename=${product[0].image}`)
      file.pipe(res)
    } else {
      return res.status(404).json('Product not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.generatePDF = async (req, res) => {
  try {
    const product = await Product.findAll({ where: { id: parseInt(req.params.id) } })
    if (product.length) {
      const pdfDoc = new PDFDocument()
      const pdf = new Date().toISOString() + '-' + 'myTestPDF.pdf'
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename=${pdf}`)
      pdfDoc.pipe(fs.createWriteStream(path.join(path.dirname(process.mainModule.filename), 'src/public/files/images', pdf)))
      pdfDoc.pipe(res)
      pdfDoc.text("Hello World!")
      pdfDoc.fontSize(18).text("Hello World!", {
        underline: true
      })
      pdfDoc.end()
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.assignProduct = async (req, res) => {
  try {
    const user = await User.findAll({ where: { id: parseInt(req.params.uid) } })
    if (user.length) {
      const product = await Product.findAll({ where: { id: parseInt(req.params.pid) } })
      if (product.length) {
        data = await user[0].addProduct(product[0])
        if (data) {
          return res.status(201).json('Product assigned successfully!')
        } else {
          return res.status(404).json('Could not assign product for user!')
        }
      } else {
        return res.status(404).json('No product found!')
      }
    } else {
      return res.status(404).json('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}
