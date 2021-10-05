import jwt from 'jsonwebtoken'

export const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '4h' // 365d
    }, (err, token) => {
      if (err) {
        console.log(err)
        reject(new Error('No se pudo generar el token'))
      } else {
        resolve(token)
      }
    })
  })
}
