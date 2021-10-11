class Menssage {
  constructor (uid, name, msg) {
    this.uid = uid
    this.name = name
    this.msg = msg
  }
}

export default class ChatMenssages {
  constructor () {
    this.msgs = []
    this.users = {}
  }

  get last10 () {
    this.msgs = this.msgs.splice(0, 10)
    return this.msgs
  }

  get usersArr () {
    return Object.values(this.users)
  }

  sendMenssage (uid, name, msg) {
    this.msgs.unshift(new Menssage(uid, name, msg))
  }

  connectUser (user) {
    this.users[user.id] = user
  }

  disconnect (id) {
    delete this.users[id]
  }
}
