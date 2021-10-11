import jwt from 'jsonwebtoken'
import Category from '../models/category.js'
import Role from '../models/role.js'
import User from '../models/user.js'
import Product from '../models/product.js'

export const isValidRole = async (rol = '') => {
  const isValidRole = await Role.findOne({ rol })
  if (!isValidRole) throw new Error(`El rol: ${rol} no existe en la base de datos.`)
}

export const isEmailTaked = async (email) => {
  const existeEmail = await User.findOne({ email })
  if (existeEmail) throw new Error('Email has already been taken')
}

export const isIdOfUser = async (id) => {
  const existeUser = await User.findById(id)
  if (!existeUser) throw new Error(`Usuario no encontrado, verifique el id: ${id}`)
}

export const isIdOfCategory = async (id) => {
  const existsCategory = await Category.findById(id)
  if (!existsCategory) throw new Error(`Categoria no encontrado, verifique el id: ${id}`)
}

export const isCategoryTaked = async (name = '') => {
  const existsCategory = await Category.findOne({ name })
  if (existsCategory) throw new Error(`La categoria: ${name} ya existe.`)
}

export const isProductTaked = async (name = '') => {
  const existsProduct = await Product.findOne({ name })
  if (existsProduct) throw new Error(`El producto: ${name} ya existe.`)
}

export const isIdOfProduct = async (id) => {
  const existsProduct = await Product.findById(id)
  if (!existsProduct) throw new Error(`Producto no encontrado, verifique el id: ${id}`)
}

export const validateColection = (colection, validColections = []) => {
  if (!validColections.includes(colection)) throw new Error(`La colección ${colection} no es permitida, las colecciones permitidas son: ${validColections}`)
  return true
}

export const validateJWT = async (token = '') => {
  try {
    if (token.length < 10) {
      return null
    }

    const { uid } = jwt.verify(token, process.env.SECRET_KEY)
    const userfound = await User.findById(uid)

    if (!userfound) return null
    if (!userfound.status) return null

    return userfound
  } catch (error) {
    return null
  }
}
