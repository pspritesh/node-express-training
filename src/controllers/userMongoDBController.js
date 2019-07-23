const User = require('../models/MongoDB/User');

exports.getUsers = async (req, res) => {
  const user = new User()
  try {
    data = await user.getAll()
    return res.send(data ? data : 'No users found!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  const user = new User()
  try {
    data = await user.get(req.params.id)
    return res.send(data ? data : 'User not found!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      data = await user.save(parsedBody)
      return res.send((data.insertedCount) ? 'User added successfully!' : 'Something went wrong!')
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
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
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      data = await user.update(parsedBody, req.params.id)
      return res.send((data.modifiedCount) ? "User updated successfully!" : 'User not updated!')
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  const user = new User()
  try {
    data = await user.delete(req.params.id)
    return res.send((data.deletedCount) ? 'User deleted successfully!' : 'User not deleted!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}