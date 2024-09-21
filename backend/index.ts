import express from 'express'
import dotenv from 'dotenv'
import connectDb from './db/connectDB'
import userRoute from './routes/user.route'
import restaurantRoute from './routes/restaurant.route'
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from "path";

dotenv.config({})

const app = express()
const PORT = process.env.PORT || 8000


const DIRNAME = path.resolve();

// Default middleware for any MERN project
app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' })) // Form data handling
app.use(cookieParser())

// Correct CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // No trailing slash
  credentials: true // Ensure lowercase
}

app.use(cors(corsOptions))

// Routes
app.use("/api/v1/user", userRoute)
app.use('/api/v1/restaurant', restaurantRoute)
app.use("/api/v1/menu", menuRoute)
app.use("/api/v1/order", orderRoute)

app.use(express.static(path.join(DIRNAME,"/frontend/dist")));
app.use("*",(_,res) => {
    res.sendFile(path.resolve(DIRNAME, "frontend","dist","index.html"));
});
// Start server
app.listen(PORT, () => {
  connectDb()
  console.log(`Server is running on port ${PORT}`)
})
