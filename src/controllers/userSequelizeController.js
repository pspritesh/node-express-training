const UserSequelize = require('../models/UserSequelize');

exports.getUsers = async (req, res) => {
  try {
    data = await UserSequelize.findAll()
    return res.send(data.length ? data : 'No users found!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  try {
    data = await UserSequelize.findAll({where: {id: parseInt(req.params.id)}})
    return res.send(data.length ? data : 'No users found!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.addUser = async (req, res) => {
  const body = []
  try {
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      var data = await UserSequelize.create({
        fname: parsedBody.fname,
        mname: parsedBody.mname,
        lname: parsedBody.lname,
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password
      })
      return res.send(data ? 'User added successfully!' : 'Something went wrong!')
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.updateUser = async (req, res) => {
  const body = []
  try {
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      var data = await UserSequelize.update({
        fname: parsedBody.fname,
        mname: parsedBody.mname,
        lname: parsedBody.lname,
        username: parsedBody.username,
        email: parsedBody.email,
        password: parsedBody.password
      },
      {
        where: {id: parseInt(req.params.id)}
      })
      return res.send(data ? 'User updated successfully!' : 'User not found!')
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  try {
    data = await UserSequelize.destroy({where: {id: parseInt(req.params.id)}})
    return res.send((data) ? 'User deleted successfully!' : 'User not found!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}