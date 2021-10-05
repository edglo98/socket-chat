import pkg from 'mongoose'
const { Schema, model } = pkg

const UserScheme = Schema({
  name: {
    type: String,
    require: [true, 'Name is require']
  },
  email: {
    type: String,
    require: [true, 'Email is require'],
    unique: true
  },
  password: {
    type: String,
    require: [true, 'Password is require']
  },
  image: {
    type: String
  },
  rol: {
    type: String,
    require: [true, 'Rol is require'],
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
    default: 'USER_ROLE'
  },
  status: {
    type: Boolean,
    default: true
  },
  google_auth: {
    type: Boolean,
    default: false
  }
})

UserScheme.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject()
  user.uid = _id
  return user
}

export default model('User', UserScheme)
