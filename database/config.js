import mongoose from 'mongoose'

const dbConection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('Base de datos conectada')
  } catch (error) {
    console.log(error)
    throw new Error('Error al conectar a la base de datos')
  }
}

export default dbConection
