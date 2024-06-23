import { layerController } from '../controller/index.js'
import express from 'express'
import upload from '../middlewares/upload.js'
const route = express.Router()
route.get('/', layerController.getAllLayer)
route.delete('/:workspace/:name', layerController.deleteLayer)
route.post('/upload', upload.any(), layerController.upload)
export default route