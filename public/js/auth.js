/* global fetch, localStorage, google, location */
const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/'
  : 'https://cafe-api-e.herokuapp.com/api/auth/'

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
      console.log(res)
      localStorage.setItem('email', res.user.email)
      localStorage.setItem('token', res.token)
    })
    .catch(console.warn)
}

const $button = document.querySelector('#google-signout')
$button.onclick = () => {
  console.log(google.accounts.id)
  google.accounts.id.disableAutoSelect()

  google.accounts.id.revoke(localStorage.getItem('email'), done => {
    localStorage.clear()
    location.reload()
  })
}

const $ = x => document.querySelector(x)

const $loginForm = $('#login-form')

$loginForm.addEventListener('submit', e => {
  e.preventDefault()
  console.log(e)
})
