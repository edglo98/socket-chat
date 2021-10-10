/* global localStorage fetch */
const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/'
  : 'https://cafe-api-e.herokuapp.com/api/auth/'

let user = null
const socket = null

const validateJWT = async () => {
  const token = localStorage.getItem('token') || ''

  if (token.length <= 10) {
    throw new Error('no hay token')
  }

  const resp = await fetch(url, {
    headers: { 'x-token': token }
  })

  const data = await resp.json()
  localStorage.setItem('token', data.token)
  user = data.user
}

const main = async () => {
  await validateJWT()
}

main()
// eslint-disable-next-line no-undef
// const socket = io()
