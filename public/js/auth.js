/* global fetch, localStorage, google, location */

const $ = x => document.querySelector(x)

const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/'
  : 'https://cafe-api-e.herokuapp.com/api/auth/'

// eslint-disable-next-line no-unused-vars
function handleCredentialResponse (response) {
  fetch(url + 'google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id_token: response.credential })
  })
    .then(res => res.json())
    .then(res => {
      localStorage.setItem('token', res.token)
      window.location = 'chat.html'
    })
    .catch(console.warn)
}

const $button = $('#google-signout')
$button.onclick = () => {
  console.log(google.accounts.id)
  google.accounts.id.disableAutoSelect()

  google.accounts.id.revoke(localStorage.getItem('email'), done => {
    localStorage.clear()
    location.reload()
  })
}

const $loginForm = $('#login-form')

$loginForm.addEventListener('submit', e => {
  e.preventDefault()
  const data = {}
  for (const element of $loginForm.elements) {
    if (element.name.length > 0) {
      data[element.name] = element.value
    }
  }

  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(({ errors, token }) => {
      if (errors) {
        return console.error(errors)
      }
      localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch(console.error)
})
