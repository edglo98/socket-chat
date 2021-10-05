import { Router } from 'express'
import { search } from '../controllers/search.js'

const routerSearch = Router()

routerSearch.get('/:colection/:term', search)

export default routerSearch
