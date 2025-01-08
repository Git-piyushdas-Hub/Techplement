import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes.js'

const app = express()

app.use(express.json())
const PORT = process.env.PORT || 8000

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database connected ${conn.connection.host} ${conn.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
connectDB()

app.use('/api/users', userRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})


