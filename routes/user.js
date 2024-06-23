import { userController } from '../controller/index.js'
import express from 'express'
import upload from '../middlewares/upload.js'
const route = express.Router()
route.get('/', userController.getAllUser)
route.post('/login', userController.login)
export default route