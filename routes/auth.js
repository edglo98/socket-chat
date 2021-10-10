import { Router } from 'express'
import { check } from 'express-validator'
import { googleSignIn, login, renewToken } from '../controllers/auth.js'
import { validateJWT } from '../middlewares/validateJWT.js'
import { validateReq } from '../middlewares/validateReq.js'

const routerUser = Router()

routerUser.post('/login', [
  check('email', 'Email es obligatorio').isEmail(),
  check('password', 'Password es obligatorio').not().isEmpty(),
  validateReq
], login)

routerUser.post('/google', [
  check('id_token', 'Token de google necesario.').not().isEmpty(),
  validateReq
], googleSignIn)

routerUser.get('/', validateJWT, renewToken)
export default routerUser
