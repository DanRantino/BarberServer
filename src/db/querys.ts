import defineModel from '../utils/defineModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models/userModel'

export const SECRET = 'segredo'

export async function loginWithPassword(user, password) {
  const schema = await defineModel('user')
  const model = schema()
  const resp = await model.findOne({ user })
  console.log(user)
  const compare = await bcrypt.compare(password, resp.password)
  if (compare) {
    const token = jwt.sign({ userId: resp._id }, SECRET, { expiresIn: '10s' })
    return { auth: true, token }
  }
  return { auth: false, msg: 'Senha incorreta' }
}

export async function createUser(obj: User) {
  const schema = await defineModel('user')
  const model = schema()
  return model.create(obj)
}

export async function findOneUser(id: string) {
  const schema = await defineModel('user')
  const model = schema()
  return model.findById(id)
}

export async function refreshToken(userId: string) {
  let newToken
  try {
    const resp = await findOneUser(userId)
    newToken = jwt.sign({ userId: resp._id }, SECRET, {
      expiresIn: '30s'
    })
  } catch (e) {
    console.error('error', e)
  }

  return { newToken }
}
