import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/index.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded(
    {
        limit: '50mb',
        extended:true
    }
))
router(app)
app.listen(PORT, () => console.log(`SEVER IS RUNING ON PORT ${PORT}`))