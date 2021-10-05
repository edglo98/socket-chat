import { Router } from 'express'
import { check } from 'express-validator'
import { deleteUser, getUser, postUser, putUser } from '../controllers/user.js'
import { isEmailTaked, isIdOfUser, isValidRole } from '../helpers/dbValidators.js'
import { validateJWT } from '../middlewares/validateJWT.js'
import { validateReq } from '../middlewares/validateReq.js'
import { haveRol } from '../middlewares/validateRoles.js'

const routerUser = Router()

routerUser.get('/', getUser)

routerUser.put('/:id', [
  check('id', 'No es un ID válido').isMongoId().custom(isIdOfUser),
  check('rol').optional().custom(isValidRole),
  validateReq
], putUser)

routerUser.post('/', [
  check('name', 'Nombre no valido o vacio.').not().isEmpty(),
  check('password', 'Contraseña invalida, deber ser mayor a 6 digitos').isLength({ min: 6 }),
  check('email', 'Correo no valido.').isEmail().custom(isEmailTaked),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom(isValidRole),
  validateReq
], postUser)

routerUser.delete('/:id', [
  validateJWT,
  // isAdminRol,
  haveRol('ADMIN_ROLE', 'SELLS_ROLE'),
  check('id', 'No es un ID válido').isMongoId().custom(isIdOfUser),
  validateReq
], deleteUser)

export default routerUser
