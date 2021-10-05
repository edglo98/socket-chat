import User from '../models/user.js'
import Category from '../models/category.js'
import Product from '../models/product.js'
import { response } from 'express'
import pkg from 'mongoose'
const { Types } = pkg

const populateUser = {
  path: 'user',
  select: '-google_auth -status'
}

const populateCategory = {
  path: 'category',
  select: '-status'
}

const validColections = [
  'users',
  'categories',
  'products',
  'roles'
]

const searchUser = async (term, res = response) => {
  const isMongoId = Types.ObjectId.isValid(term)

  if (isMongoId) {
    const user = await User.findById(term)
    return res.json({
      results: user ? [user] : []
    })
  }

  const regex = new RegExp(term, 'i')
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }]
  })

  res.json({
    results: users
  })
}

const searchCategories = async (term, res = response) => {
  const isMongoId = Types.ObjectId.isValid(term)

  if (isMongoId) {
    const category = await Category.findById(term)
    return res.json({
      results: category ? [category] : []
    })
  }

  const regex = new RegExp(term, 'i')
  const categories = await Category.find({ name: regex, status: true })

  res.json({
    results: categories
  })
}

const searchProducts = async (term, res = response) => {
  const isMongoId = Types.ObjectId.isValid(term)

  if (isMongoId) {
    const product = await Product
      .findById(term)
      .populate([populateUser, populateCategory])
    return res.json({
      results: product ? [product] : []
    })
  }

  const regex = new RegExp(term, 'i')
  const products = await Product
    .find({
      $or: [{ name: regex }, { description: regex }],
      $and: [{ status: true }]
    })
    .populate([populateUser, populateCategory])

  res.json({
    results: products
  })
}

export const search = (req, res = response) => {
  const { colection, term } = req.params

  if (!validColections.includes(colection)) {
    return res.status(400).json({
      msg: `Colecion no permitida, las colecciones permitidas son: ${validColections}`
    })
  }

  switch (colection) {
    case 'users':
      searchUser(term, res)
      break
    case 'categories':
      searchCategories(term, res)
      break
    case 'products':
      searchProducts(term, res)
      break

    default:
      res.status(500).json({
        msg: 'Validacion faltante. Comunicate con el backend'
      })
      break
  }
}
