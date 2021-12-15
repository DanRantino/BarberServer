import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import connectMongo from './db/connect'
import { loginWithPassword, refreshToken } from './db/querys'
import decodeToken from './utils/decodeToken'

dotenv.config()

const app = express()
app.use(cors())

interface Req extends Request {
  userId: string
}

const SECRET = 'segredo'

function verifyJWT(req: Req, res: Response, next: NextFunction) {
  const token = req.get('authorization')
  next(decodeToken(token))
}


app.use(cors())
app.use(bodyParser.json())

app.post('/login', async (req: Request, res: Response) => {
  const { user, password } = req.body
  const resp = await loginWithPassword(user, password)
  res.send(resp)
})

app.post('/refresh-login', async (req: Request, res: Response) => {
  const token = req.get('authorization')
  const decode = decodeToken(token)
  let resp
  if (typeof decode !== 'number') {
    let resp = await refreshToken(decode.userId)
    res.status(200)
  } else {
    res.status(decode)
  }
  res.send(resp)
})


app.listen(process.env.PORT || 5000, () => {
  console.log(`${process.env.PORT || 5000}`)
})

connectMongo().then()
