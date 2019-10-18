const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const randomstring = require("randomstring")

const mailer = require('../config/mailer')
const Product = require('../models/Mongoose/Product')
const User = require('../models/Mongoose/User')

exports.getUsers = async (req, res) => {
  try {
    const itemsPerPage = 4
    const userCount = await User.find().countDocuments()
    const users = await User.find().skip(((req.query.page ? req.query.page : 1) - 1) * itemsPerPage).limit(itemsPerPage)
    if (users.length) {
      return res.json({
        data: users,
        totalPages: Math.ceil(userCount/itemsPerPage)
      })
    } else {
      return res.status(404).json('No users found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id)
    if (data) {
      return res.json(data)
    } else {
      return res.status(404).json('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.addUser = async (req, res) => {
  try {
    const data = await User.findOne({ username: req.body.username })
    if (!data) {
      const hashedPassword = await bcrypt.hash(req.body.password, 256)
      const user = await User.create({
        profile: {
          fname: req.body.fname,
          mname: req.body.mname,
          lname: req.body.lname
        },
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        apiToken: randomstring.generate()
      })
      if (user) {
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
        return res.status(404).json('Something went wrong!')
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
    const hashedPassword = await bcrypt.hash(req.body.password, 256)
    const user = await User.findByIdAndUpdate(req.params.id, {
      profile: {
        fname: req.body.fname,
        mname: req.body.mname,
        lname: req.body.lname
      },
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      apiToken: randomstring.generate()
    }, {useFindAndModify: false})
    if (user) {
      return res.status(201).json('User updated successfully!')
    } else {
      return res.status(404).json('Nothing to update!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id, {useFindAndModify: false})
    if (user) {
      return res.json('User delete successfully!')
    } else {
      return res.status(404).json('Nothing to delete!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const itemsPerPage = 1
    const productCount = await Product.aggregate([
      { $match: { price: { $gte: 10 } } },
      { $group: { _id: "$name", total: { $sum: "$price" } } },
    ])
    const products = await Product.aggregate([
      { $match: { price: { $gte: 10 } } },
      { $group: { _id: "$name", total: { $sum: "$price" } } },
      // { $count: "count" },
      { $skip: ((req.query.page ? req.query.page : 1) - 1) * itemsPerPage },
      { $limit: itemsPerPage }
    ])
    if (products.length) {
      return res.json({
        data: products,
        totalPages: Math.ceil(productCount.length/itemsPerPage)
      })
    } else {
      return res.status(404).json('No products found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.getUserProducts = async (req, res) => {
  try {
    const userProducts = await User.findById(req.params.id).select('products -_id').populate('products')
    if (userProducts) {
      return res.json(userProducts)
    } else {
      return res.status(404).json('Products not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.createProduct = async (req, res) => {
  try {
    const data = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    })
    if (data) {
      return res.status(201).json('Product added successfully!')
    } else {
      return res.status(404).json('Could not add product!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    }, {useFindAndModify: false})
    if (product) {
      return res.status(201).json('Product updated successfully!')
    } else {
      return res.status(404).json('Product not updated!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    const userData = await User.findById(req.params.id)
    if (userData) {
      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
      })
      if (product) {
        userData.products.push(product)
        const user = await User.findByIdAndUpdate(req.params.id, userData, {useFindAndModify: false})
        if (user) {
          return res.status(201).json('Product created and assigned to user successfully!')
        } else {
          return res.status(404).json('Could not assign product to user!')
        }
      } else {
        return res.status(404).json('Could not create product!')
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
    const product = await Product.findById(req.params.id)
    if (product) {
      const productImage = req.file
      if (productImage) {
        const product = await Product.findByIdAndUpdate(req.params.id, {
          image: productImage.path
        }, {useFindAndModify: false})
        if (product) {
          return res.status(201).json('Image assigned to product successfully!')
        } else {
          return res.status(404).json('No image found to upload!')
        }
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
    const product = await Product.findById(req.params.id)
    if (product) {
      /**** Sending file path in response */
      // return res.status(200).json(product.image)

      /**** Reading the entire file to make it available for users */
      // fs.readFile(path.join(path.dirname(process.mainModule.filename), product.image), (err, data) => {
      //   if (err) {
      //     return res.status(404).json("File not found!")
      //   }
      //   res.setHeader('Content-Type', 'application/jpg')
      //   res.setHeader('Content-Disposition', `inline; filename=${product.image}`)
      //   return res.status(200).json(data)
      // })

      /**** Streaming the file for users */
      const file = fs.createReadStream(path.join(path.dirname(process.mainModule.filename), product.image))
      res.setHeader('Content-Type', 'application/jpg')
      res.setHeader('Content-Disposition', `inline; filename=${product.image}`)
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
    const product = await Product.findById(req.params.id)
    if (product) {
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
    const user = await User.findById(req.params.uid)
    if (user) {
      const product = await Product.findById(req.params.pid)
      if (product) {
        user.products.push(product)
        /**** Here to store all the raw data (without other metadata and other stuff) from this product, we can use _doc */
        // user.products.push(product._doc)
        const newUserData = await User.findByIdAndUpdate(req.params.uid, user, {useFindAndModify: false})
        if (newUserData) {
          return res.status(201).json('Product assigned successfully!')
        } else {
          return res.status(404).json('Could not assign product to user!')
        }
      } else {
        return res.status(404).json('Product not found!')
      }
    } else {
      return res.status(404).json('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      const userData = await User.find()
      count = 0
      userData.forEach(user => {
        if (user.products.pull(product)) count++
        user.save()
      })
      const deleteProduct = await Product.findByIdAndDelete(req.params.id, {useFindAndModify: false})
      if (deleteProduct) {
        return res.json((count > 0) ? "Product deleted and cascaded successfully!" : "Product deleted successfully!")
      } else {
        return res.status(404).json("Unable to delete product!")
      }
    } else {
      return res.status(404).json("No product to delete!")
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}
