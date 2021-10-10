import { response } from 'express'
import User from '../models/user.js'
import bcryptjs from 'bcryptjs'
import { generateJWT } from '../helpers/generateJWT.js'
import { googleVerify } from '../helpers/googleValidators.js'

export const login = async (req, res = response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        msg: 'Usuario no encontrado, verifique el correo.'
      })
    }

    if (!user.status) {
      return res.status(400).json({
        msg: 'Usuario desahabilitado.'
      })
    }

    const validPassword = bcryptjs.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Contraseña invalida o erronea.'
      })
    }

    const token = await generateJWT(user.id)

    res.json({
      user,
      token
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Comuniquese con el administrador.'
    })
  }
}

export const googleSignIn = async (req, res) => {
  const { id_token: idToken } = req.body

  try {
    const { name, email, image } = await googleVerify(idToken)

    let user = await User.findOne({ email })

    if (!user) {
      const data = {
        name,
        email,
        image,
        password: '>:(',
        google: true
      }

      user = new User(data)

      await user.save()
    }

    if (!user.status) {
      return res.status(401).json({
        msg: 'Usuario inhabilitado.'
      })
    }

    const token = await generateJWT(user.id)

    res.json({
      user,
      token
    })
  } catch (error) {
    res.status(400).json({
      msg: 'El token no paso la verificación'
    })
  }
}

export const renewToken = async (req, res) => {
  const { user } = req

  const token = await generateJWT(user.id)

  res.json({
    user,
    token
  })
}
