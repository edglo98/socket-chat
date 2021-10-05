import { Router } from 'express'
import { check } from 'express-validator'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/products.js'
import { validateJWT } from '../middlewares/validateJWT.js'
import { validateReq } from '../middlewares/validateReq.js'
import { isIdOfCategory, isIdOfProduct, isProductTaked } from '../helpers/dbValidators.js'
import { isAdminRol } from '../middlewares/validateRoles.js'

const routerProducts = Router()

routerProducts.get('/', getProducts)

routerProducts.get('/:id', [
  check('id', 'El id debe ser un id valida')
    .isMongoId()
    .bail()
    .custom(isIdOfProduct),
  validateReq
], getProduct)

routerProducts.post('/', [
  validateJWT,
  check('name', 'El nombre es obligatorio')
    .not()
    .isEmpty()
    .bail()
    .custom(isProductTaked),
  check('category', 'La categoria id es obligatoria')
    .not()
    .isEmpty()
    .bail()
    .isMongoId()
    .bail()
    .custom(isIdOfCategory),
  validateReq
], createProduct)

routerProducts.put('/:id', [
  validateJWT,
  check('id', 'El id debe ser un id valida')
    .isMongoId()
    .bail()
    .custom(isIdOfProduct),
  check('name', 'El nombre es requerido').optional().custom(isProductTaked),
  validateReq
], updateProduct)

routerProducts.delete('/:id', [
  validateJWT,
  isAdminRol,
  check('id', 'El id debe ser un id valida')
    .isMongoId()
    .bail()
    .custom(isIdOfProduct),
  validateReq
], deleteProduct)

export default routerProducts
