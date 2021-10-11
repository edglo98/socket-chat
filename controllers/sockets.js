import { validateJWT } from '../helpers/dbValidators.js'
import ChatMenssages from '../models/chat.js'

const chatMenssages = new ChatMenssages()
export const socketController = async (socket, io) => {
  const token = socket.handshake.headers['x-token']
  const user = await validateJWT(token)

  if (!user) return socket.disconnect()

  chatMenssages.connectUser(user)
  io.emit('users-online', chatMenssages.usersArr)
  socket.emit('get-msg', chatMenssages.last10)

  socket.join(user.id)

  socket.on('disconnect', () => {
    chatMenssages.disconnect(user.id)
    io.emit('users-online', chatMenssages.usersArr)
  })

  socket.on('send-msg', ({ msg, uid }) => {
    if (uid) {
      socket.to(uid).emit('private-msg', { from: user.name, msg })
    } else {
      chatMenssages.sendMenssage(user.id, user.name, msg)
      io.emit('get-msg', chatMenssages.last10)
    }
  })
}
