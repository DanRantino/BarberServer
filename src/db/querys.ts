import defineModel from '../utils/defineModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models/userModel'
import { errorTypes } from '../types/errorTypes'

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
  let resp: errorTypes = {
    data: '',
    status: 0
  }
  try {
    const schema = await defineModel('user')
    const model = schema()
    obj.password = await bcrypt.hash(obj.password, 10)
    resp.data = await model.create(obj).catch((e) => {
      throw e
    })
    resp.status = 200
  } catch (e) {
    resp.data = 'error'
    resp.status = 500
  }
  return resp

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
      expiresIn: '5m'
    })
  } catch (e) {
    console.error('error', e)
  }

  return { newToken }
}
