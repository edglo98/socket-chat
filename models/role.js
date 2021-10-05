import pkg from 'mongoose'
const { Schema, model } = pkg

const RoleScheme = Schema({
  rol: {
    type: 'string',
    require: [true, 'El rol es obligatorio']
  }
})

export default model('Role', RoleScheme)
