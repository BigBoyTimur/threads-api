import express, {urlencoded} from 'express'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import router from "./routes/index.js";
import * as fs from "fs";
import cors from 'cors';

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

//раздавать статические файлы из папки uploads
app.use('/uploads', express.static('uploads'))

app.use('/api', router)

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

app.listen(port, () => {
  console.log(`app is running on port: ${port}`)
})