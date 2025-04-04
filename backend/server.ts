import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: "http://localhost:3321",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const port = 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))
