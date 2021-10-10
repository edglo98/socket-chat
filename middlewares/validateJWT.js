import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const validateJWT = async (req, res, next) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      msg: 'No autorizado, hace falta un token.'
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY)

    const user = await User.findById(uid)

    if (!user) {
      return res.status(401).json({
        msg: 'Token no válido, usuario no encontrado'
      })
    }

    if (!user.status) {
      return res.status(401).json({
        msg: 'Token no válido, usuario deshabilitado'
      })
    }

    req.user = user
    next()
  } catch (err) {
    console.log(err)
    res.status(401).json({
      msg: 'Token no válido',
      err
    })
  }
}
