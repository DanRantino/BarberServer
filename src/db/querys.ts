import defineModel from '../utils/defineModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const SECRET = 'segredo'

export async function loginWithPassword(user, password) {
  const schema = await defineModel('user')
  const model = schema()
  const resp = await model.findOne({ user })
  const compare = await bcrypt.compare(password, resp.password)
  if (compare) {
    const token = jwt.sign({ userId: resp._id }, SECRET, { expiresIn: '20s' })
    return { auth: true, token }
  }
  return { auth: false, msg: 'Senha incorreta' }
}

export async function findOneUser(id: string) {
  const schema = await defineModel('user')
  const model = schema()
  return model.findById(id)
}

export async function refreshToken(userId: string) {
  const resp = await findOneUser(userId)
  const newToken = jwt.sign({ userId: resp._id }, SECRET, {
    expiresIn: '10m'
  })

  return { newToken }
}
