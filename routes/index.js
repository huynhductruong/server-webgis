import userRouter from './user.js'
import layerRouter from './layer.js'
const router = (app) => {
    app.use('/users', userRouter)
    app.use('/layers', layerRouter)
}
export default  router