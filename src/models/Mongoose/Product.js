const { Schema, model } = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

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

productSchema.plugin(aggregatePaginate)
module.exports = model('product', productSchema)
