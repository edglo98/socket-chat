import { Router } from 'express'
import { check } from 'express-validator'
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categories.js'
import { isCategoryTaked, isIdOfCategory } from '../helpers/dbValidators.js'
import { validateJWT } from '../middlewares/validateJWT.js'
import { validateReq } from '../middlewares/validateReq.js'
import { isAdminRol } from '../middlewares/validateRoles.js'

const routerCategory = Router()

routerCategory.get('/', getCategories)

routerCategory.get('/:id', [
  check('id', 'El id debe ser un id valida').isMongoId().custom(isIdOfCategory),
  validateReq
], getCategory)

// privado con cualquier persona con token
routerCategory.post('/', [
  validateJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  validateReq
], createCategory)

// actualizar privado
routerCategory.put('/:id', [
  validateJWT,
  check('id', 'El id debe ser un id valida').isMongoId().custom(isIdOfCategory),
  check('name', 'El nombre es requerido').not().isEmpty().custom(isCategoryTaked),
  validateReq
], updateCategory)

// actualizar privado
routerCategory.delete('/:id', [
  validateJWT,
  // haveRol('ADMIN_ROLE'),
  isAdminRol,
  check('id', 'El id debe ser un id valida').isMongoId().custom(isIdOfCategory),
  validateReq
], deleteCategory)

export default routerCategory
