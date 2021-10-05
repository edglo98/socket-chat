import { v4 as uuidv4 } from 'uuid'
const defaultValidExtensions = ['png', 'jpg', 'jpeg', 'gif']

export const uploadFile = (files, validExtension = defaultValidExtensions, folder) => {
  return new Promise((resolve, reject) => {
    const { file } = files

    const nameWithDotsSplited = file.name.split('.')
    const [extension] = nameWithDotsSplited.splice(nameWithDotsSplited.length - 1, 1)

    if (!validExtension.includes(extension)) {
      return reject(new Error(`La extension ${extension} no es permitida. Extensiones permitidas son: ${validExtension}`))
    }
    const slugName = nameWithDotsSplited
      .map(element => element.replace(/ /g, '_'))
      .concat([uuidv4()])
      .join('_')

    const fileName = `${slugName}.${extension}`

    const { pathname } = new URL(`../uploads/${folder ? folder + '/' : ''}${fileName}`, import.meta.url)

    file.mv(pathname, (err) => {
      if (err) {
        return reject(err)
      }

      resolve(fileName)
    })
  })
}
