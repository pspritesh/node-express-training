const db = require('../../config/dbconfig')

module.exports = class User {
  getAll() {
    return db.execute('SELECT * FROM users')
  }

  get(id) {
    return db.execute(`SELECT * FROM users WHERE id=?`, [id])
  }

  save(user) {
    return db.execute(`INSERT INTO users (fname, mname, lname, username, email, password) 
      VALUES (?, ?, ?, ?, ?, ?)`, [user.fname, user.mname, user.lname, user.username, user.email, user.password])
  }

  update(user, id) {
    return db.execute(`UPDATE users SET fname=?, mname=?, lname=?, username=?, email=?, password=?
      WHERE id=?`, [user.fname, user.mname, user.lname, user.username, user.email, user.password, id])
  }

  delete(id) {
    return db.execute(`DELETE FROM users WHERE id=?`, [id])
  }
}