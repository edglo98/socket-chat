import pkg from 'mongoose'
const { Schema, model } = pkg

const CategorySchema = Schema({
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
  }
})

CategorySchema.methods.toJSON = function () {
  const { __v, ...category } = this.toObject()

  return category
}
export default model('Category', CategorySchema)
