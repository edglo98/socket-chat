import pkg from 'mongoose'
const { Schema, model } = pkg

const ProductSchema = Schema({
  name: {
    type: 'string',
    require: [true, 'El nombre es obligatorio'],
    unique: true
  },
  status: {
    type: Boolean,
    default: true,
    require: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    require: true
  },
  description: {
    type: String
  },
  stock: {
    type: Number
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  }
})

ProductSchema.methods.toJSON = function () {
  const { __v, ...product } = this.toObject()

  return product
}
export default model('Product', ProductSchema)
