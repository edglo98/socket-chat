/* global localStorage fetch io */
const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/'
  : 'https://cafe-api-e.herokuapp.com/api/auth/'

let user = null
let socket = null
const $ = element => document.querySelector(element)

const $txtUid = $('#txtUid')
const $txtMensaje = $('#txtMensaje')
const $ulUsuarios = $('#ulUsuarios')
const $ulMensajes = $('#ulMensajes')
const $btnSalir = $('#btnSalir')

const validateJWT = async () => {
  const token = localStorage.getItem('token') || ''

  if (token.length <= 10) {
    window.location = 'index.html'
    throw new Error('no hay token')
  }

  const resp = await fetch(url, {
    headers: { 'x-token': token }
  })

  const data = await resp.json()
  localStorage.setItem('token', data.token)
  user = data.user
  document.title = user.name

  await connectSocket()
}

const connectSocket = async () => {
  socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('token')
    }
  })

  socket.on('connect', () => {
    console.log('Sockets Online')
  })

  socket.on('disconnect', () => {
    console.log('Sockets Offline')
  })

  socket.on('get-msg', payload => {
    console.log(payload)
  })

  socket.on('users-online', renderUser)

  socket.on('msg-private', () => {

  })
}

const renderUser = (users = []) => {
  $ulUsuarios.innerHTML = users.map(({ name, uid }) => {
    return `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `
  })
    .join('')
}

$txtMensaje.addEventListener('keyup', ({ keyCode }) => {
  const msg = $txtMensaje.value
  const uid = $txtUid.value
  if (keyCode !== 13) return
  if (msg.length === 0) return

  socket.emit('send-msg', { msg, uid })
  $txtMensaje.value = ''
})

const main = async () => {
  await validateJWT()
}

main()
