import { validateJWT } from '../helpers/dbValidators.js'
export const socketController = async socket => {
  const token = socket.handshake.headers['x-token']
  const user = await validateJWT(token)

  if (!user) return socket.disconnect()
  console.log(user)
}
