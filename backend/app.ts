import dotenv from 'dotenv'
import express, { Express } from 'express'
import connectDB from './src/config/db'

dotenv.config()
connectDB()

const app: Express = express()
const port: number = 1234

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
