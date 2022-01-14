import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = 'segredo';

export default function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.get('authorization');
  if (!token) {
    return res.status(500).json({ error: 'internal error' }).end();
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'internal error' }).end();
    }
    return next();
  });
  return next();
}
