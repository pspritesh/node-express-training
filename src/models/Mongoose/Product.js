const { Schema, model } = require('mongoose')

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  }
},
{
  timestamps: true
})

module.exports = model('product', productSchema)
