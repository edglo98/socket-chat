import { response } from 'express'
import User from '../models/user.js'
import bcryptjs from 'bcryptjs'

export const getUser = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query
  const rules = { status: true }

  if (isNaN(Number(limit)) || isNaN(Number(from))) {
    return res.status(400).json({
      msg: 'Los parametros limit/from deben ser numeros'
    })
  }

  const [total, users] = await Promise.all([
    User.countDocuments(rules),
    User.find(rules)
      .skip(Number(from))
      .limit(Number(limit))
  ])

  res.json({
    total,
    users
  })
}

export const putUser = async (req, res = response) => {
  const { id } = req.params
  // eslint-disable-next-line camelcase
  const { _id, password, google_auth, email, ...rest } = req.body

  if (password) {
    const salt = bcryptjs.genSaltSync() // tipo de encriptado
    rest.password = bcryptjs.hashSync(password, salt) // metodo para encriptar
  }

  const user = await User.findByIdAndUpdate(id, rest, { new: true }) // new true para que regrese el nuevo valor

  res.status(202).json(user)
}

export const postUser = async (req, res = response) => {
  const { name, email, password, rol } = req.body
  const user = new User({ name, email, password, rol })

  const salt = bcryptjs.genSaltSync() // tipo de encriptado
  user.password = bcryptjs.hashSync(password, salt) // metodo para encriptar

  await user.save()

  res.status(201).json(user)
}

export const deleteUser = async (req, res = response) => {
  const { id } = req.params

  const user = await User.findByIdAndUpdate(id, { status: false })
  res.json(user)
}
