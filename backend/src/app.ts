import 'dotenv/config'
import express, { Express } from 'express'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import cors, { CorsOptions } from 'cors'
import cookieParser from 'cookie-parser'

connectDB()

const app: Express = express()
const port: number = 1234

const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/auth', authRoutes)

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
