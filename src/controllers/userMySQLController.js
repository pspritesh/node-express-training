const UserMySQL = require('../models/UserMySQL');

exports.getUsers = async (req, res) => {
  const user = new UserMySQL()
  try {
    data = await user.getAll()
    return res.send(data[0].length ? data[0] : 'No users found!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.getUser = async (req, res) => {
  const user = new UserMySQL()
  try {
    data = await user.get(parseInt(req.params.id))
    return res.send(data[0].length ? data[0] : 'User not found!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.addUser = async (req, res) => {
  const user = new UserMySQL()
  const body = []
  try {
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      data = await user.save(parsedBody)
      return res.send((data[0].affectedRows) ? 'User added successfully!' : 'Something went wrong!')
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.updateUser = async (req, res) => {
  const user = new UserMySQL()
  const body = []
  try {
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', async () => {
      const parsedBody = JSON.parse(Buffer.concat(body).toString()).data
      data = await user.update(parsedBody, parseInt(req.params.id))
      return res.send((data[0].affectedRows) ? 'User updated successfully!' : 'User not found!')
    })
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}

exports.deleteUser = async (req, res) => {
  const user = new UserMySQL()
  try {
    data = await user.delete(parseInt(req.params.id))
    return res.send((data[0].affectedRows) ? 'User deleted successfully!' : 'User not found!')
  } catch (error) {
    console.error(error)
    return res.send("Something went wrong!")
  }
}