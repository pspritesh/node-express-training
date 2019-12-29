const bcrypt = require('bcrypt');
const datetime = require('node-datetime');
const randomstring = require('randomstring');

const db = require('../../config/dbconfig/MySQLDB');

module.exports = class User {
  getAll() {
    return db.execute('SELECT * FROM users');
  }

  get(id) {
    return db.execute(`SELECT * FROM users WHERE id=?`, [id]);
  }

  async save(user) {
    const hashedPassword = await bcrypt.hash(user.password, 256);
    const users = await db.execute(
      `INSERT INTO users (username, email, password, api_token, api_token_created_at, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`, [user.username, user.email, hashedPassword, randomstring.generate(), datetime.create().format('Y-m-d H:M:S'), datetime.create().format('Y-m-d H:M:S'), datetime.create().format('Y-m-d H:M:S')]
    );

    if (users[0].affectedRows) {
      return db.execute(
        `INSERT INTO profiles (fname, mname, lname, created_at, updated_at, user_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [user.fname, user.mname, user.lname, datetime.create().format('Y-m-d H:M:S'), datetime.create().format('Y-m-d H:M:S'), users[0].insertId]
      );
    } else {
      return false;
    }
  }

  async update(user, id) {
    const hashedPassword = await bcrypt.hash(user.password, 256);
    const users = await db.execute(
      `UPDATE users SET username=?, email=?, password=?, updated_at=? WHERE id=?`, 
      [user.username, user.email, hashedPassword, datetime.create().format('Y-m-d H:M:S'), id]
    );

    if (users[0].affectedRows) {
      return db.execute(
        `UPDATE profiles SET fname=?, mname=?, lname=?, updated_at=? WHERE user_id=?`,
        [user.fname, user.mname, user.lname, datetime.create().format('Y-m-d H:M:S'), id]
      );
    } else {
      return false;
    }
  }

  async delete(id) {
    const users = await db.execute(`DELETE FROM profiles WHERE user_id=?`, [id]);

    if (users[0].affectedRows) {
      return db.execute(`DELETE FROM users WHERE id=?`, [id]);
    } else {
      return false;
    }
  }
}
