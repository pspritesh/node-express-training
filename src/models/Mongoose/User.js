const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    fname: {
      type: String,
      required: true
    },
    mname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    }
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  apiToken: {
    type: String,
    required: true
  },
  products: [
    {
      type: mongoose.ObjectId,
      ref: 'Product'
    }
  ]
},
{
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
