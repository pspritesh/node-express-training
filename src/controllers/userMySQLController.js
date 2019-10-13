const mailer = require('../config/mailer')
const User = require('../models/MySQL/User')

exports.getUsers = async (req, res) => {
  const user = new User()
  try {
    data = await user.getAll()
    if (data[0].length) {
      return res.json(data[0])
    } else {
      return res.status(404).json('No users found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  const user = new User()
  try {
    data = await user.get(parseInt(req.params.id))
    if (data[0].length) {
      return res.json(data[0])
    } else {
      return res.status(404).json('No users found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.addUser = async (req, res) => {
  const user = new User()
  const body = []
  try {
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      data = await user.save(parsedBody)
      if (data && data[0].affectedRows) {
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
        return res.status(201).json('User added successfully!')
      } else {
        return res.status(404).json('Could not add user!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.updateUser = async (req, res) => {
  const user = new User()
  const body = []
  try {
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString())
      data = await user.update(parsedBody, parseInt(req.params.id))
      if (data && data[0].affectedRows) {
        return res.status(201).json('User updated successfully!')
      } else {
        return res.status(404).json('User not found!')
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  const user = new User()
  try {
    data = await user.delete(parseInt(req.params.id))
    if (data && data[0].affectedRows) {
      return res.json('User deleted successfully!')
    } else {
      return res.status(404).json('User not found!')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json("Something went wrong!")
  }
}
