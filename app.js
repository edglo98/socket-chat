import dotenv from 'dotenv'
import { Server } from './models/server.js'

dotenv.config() // configuracion inicial de dotenv

const server = new Server()

server.listen()
