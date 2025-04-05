import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";

const app = express()

app.use(cors({
    origin: "http://localhost:3321",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

dotenv.config()

const port = 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))
