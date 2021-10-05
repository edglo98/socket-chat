import { response } from 'express'
import Product from '../models/product.js'

const populateUser = {
  path: 'user',
  select: '-google_auth -status'
}

const populateCategory = {
  path: 'category',
  select: '-status'
}

export const getProducts = async (req, res = response) => {
  const rules = { status: true }
  const { limit = 5, from = 0 } = req.query

  if (isNaN(Number(limit)) || isNaN(Number(from))) {
    return res.status(400).json({
      msg: 'Los parametros limit/from deben ser numeros'
    })
  }

  const [total, categories] = await Promise.all([
    Product.countDocuments(rules),
    Product.find(rules)
      .skip(Number(from))
      .limit(Number(limit))
      .populate([populateUser, populateCategory])
  ])

  res.json({
    total,
    categories
  })
}

export const getProduct = async (req, res = response) => {
  const { id } = req.params

  const product = await Product.findOne({ _id: id, status: true })
    .populate([populateUser, populateCategory])

  res.json(product)
}

export const createProduct = async (req, res = response) => {
  const { status, user, ...data } = req.body
  data.user = req.user._id

  let product = new Product(data)
  await product.save()

  product = await product
    .populate([populateUser, populateCategory])

  res.status(201).json(product)
}

export const updateProduct = async (req, res = response) => {
  const { id } = req.params
  const { status, user, ...data } = req.body
  data.user = req.user._id

  const product = await Product
    .findByIdAndUpdate(id, data, { new: true })
    .populate([populateUser, populateCategory])

  res.status(202).json(product)
}

export const deleteProduct = async (req, res = response) => {
  const { id } = req.params

  const product = await Product
    .findByIdAndUpdate(id, { status: false }, { new: true })
    .populate([populateUser, populateCategory])

  res.json(product)
}
