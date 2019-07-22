const db = require('../../config/dbconfig/MySQLDB')

module.exports = class User {
  getAll() {
    return db.execute('SELECT * FROM users')
  }

  get(id) {
    return db.execute(`SELECT * FROM users WHERE id=?`, [id])
  }

  save(user) {
    return db.execute(`INSERT INTO users (username, email, password) 
      VALUES (?, ?, ?)`, [user.username, user.email, user.password])
  }

  update(user, id) {
    return db.execute(`UPDATE users SET username=?, email=?, password=?
      WHERE id=?`, [user.username, user.email, user.password, id])
  }

  delete(id) {
    return db.execute(`DELETE FROM users WHERE id=?`, [id])
  }
}