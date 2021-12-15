import jwt from 'jsonwebtoken'

const SECRET = 'segredo'

type ret = {
  userId: string,
  iat: number,
  exp: number
}

const decodeToken = (token): ret | number => {
  let ret
  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) ret = 401
    if (decoded) {
      ret = decoded
    }
  })
  return ret
}

export default decodeToken
