import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import connectMongo from './db/connect'
import { createUser, loginWithPassword, refreshToken } from './db/querys'
import multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'
import decodeToken from './utils/decodeToken'

dotenv.config()

const app = express()
app.use(cors())

interface Req extends Request {
  userId: string
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads')
  },
  filename: (req: Request, file: Express.Multer.File, callback) => {
    callback(null, file.originalname)
  }
})

const upload = multer({ storage })

const SECRET = 'segredo'

function verifyJWT(req: Req, res: Response, next: NextFunction) {
  const token = req.get('authorization')
  console.log(token)
  /*if (!token) {
    return res.status(401).end()
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).end()
    }
    next()
  })
  */

  next()
}


app.use(cors())
app.use(bodyParser.json())

app.post('/signup', upload.single('image'), async (req, res, next) => {
  const { user, password } = req.body
  const img = {
    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.originalname)),
    contentType: 'image/png'
  }
  const resp = await createUser({
    user, password,
    image: {
      ...img
    }
  })
  res.send(resp).status(200)
})

app.post('/login', async (req: Request, res: Response) => {
  console.log(req.body)
  const { user, password } = req.body
  const resp = await loginWithPassword(user, password)
  res.send(resp)
})

app.post('/refresh-login', verifyJWT, async (req: Request, res: Response) => {
  const token = req.get('authorization')
  const decode = decodeToken(token)
  let resp, status
  if (typeof decode !== 'number') {
    resp = await refreshToken(decode.userId)
    status = 200
  } else {
    status = 401
  }
  res.send(resp).status(status).end()
})


app.listen(process.env.PORT || 5000, () => {
  console.log(`${process.env.PORT || 5000}`)
})


connectMongo().then()
