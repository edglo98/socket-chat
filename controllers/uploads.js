import { response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import cloudinary from 'cloudinary'
import { uploadFile } from '../helpers/uploadFile.js'
import User from '../models/user.js'
import Product from '../models/product.js'

export const loadFile = async (req, res = response) => {
  try {
    const nombre = await uploadFile(req.files, [
      'png',
      'jpg',
      'jpeg',
      'gif'
    ], '')
    res.json({ nombre })
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ error: err.message })
  }
}

// export const updateAndLoadFile = async (req, res = response) => {
//   const { colection, id } = req.params

//   let model
//   switch (colection) {
//     case 'users':
//       model = await User.findById(id)
//       if (!model) {
//         return res.status(400).json({
//           msg: `No exciste un usuario con el id: ${id}`
//         })
//       }
//       break
//     case 'products':
//       model = await Product.findById(id)
//       if (!model) {
//         return res.status(400).json({
//           msg: `No exciste un producto con el id: ${id}`
//         })
//       }
//       break

//     default:
//       return res.status(500).json({
//         msg: 'No hay validacion de modelo, error interno'
//       })
//   }

//   if (model.image) {
//     const { pathname: pathImage } = new URL(`../uploads/${colection}/${model.image}`, import.meta.url)

//     if (fs.existsSync(pathImage)) {
//       fs.unlinkSync(pathImage)
//     }
//   }

//   const fileName = await uploadFile(req.files, undefined, colection)
//   model.image = fileName
//   model.save()

//   res.json(model)
// }

export const updateAndLoadFile = async (req, res = response) => {
  // TODO: Porque no funciona fuera de la funcion?
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
  const { colection, id } = req.params
  const { file } = req.files
  let model
  switch (colection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res.status(400).json({
          msg: `No exciste un usuario con el id: ${id}`
        })
      }
      break
    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res.status(400).json({
          msg: `No exciste un producto con el id: ${id}`
        })
      }
      break

    default:
      return res.status(500).json({
        msg: 'No hay validacion de modelo, error interno'
      })
  }

  if (model.image) {
    const splitUrl = model.image.split('/')
    const name = splitUrl[splitUrl.length - 1]
    const [publicId] = name.split('.')
    cloudinary.v2.uploader.destroy(publicId)
  }

  const nameWithDotsSplited = file.name.split('.')
  nameWithDotsSplited.pop()

  // TODO: validar extensiones
  // if (!validExtension.includes(extension)) {
  //   return reject(new Error(`La extension ${extension} no es permitida. Extensiones permitidas son: ${validExtension}`))
  // }

  const slugName = nameWithDotsSplited
    .map(element => element.replace(/ /g, '_'))
    .concat([uuidv4()])
    .join('_')

  try {
    const { secure_url: secureUrl } = await cloudinary.v2.uploader.upload(file.tempFilePath, { public_id: slugName })
    model.image = secureUrl

    await model.save()
    res.json(model)
  } catch (err) {
    console.log({ err })
    res.status(500).json({ err })
  }
}

export const getImages = async (req, res = response) => {
  const { colection, id } = req.params

  let model
  switch (colection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res.status(400).json({
          msg: `No exciste un usuario con el id: ${id}`
        })
      }
      break
    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res.status(400).json({
          msg: `No exciste un producto con el id: ${id}`
        })
      }
      break

    default:
      return res.status(500).json({
        msg: 'No hay validacion de modelo, error interno'
      })
  }

  const imageLocationResponse = model.image
    ? `../uploads/${colection}/${model.image}`
    : '../assets/no-image.jpg'

  const { pathname: pathImage } = new URL(imageLocationResponse, import.meta.url)

  res.sendFile(pathImage)
}
