import { Schema } from 'mongoose'

export const userSchema = new Schema({
  user: { type: 'string', unique: true },
  password: { type: 'string' },
  updatedAt: { type: Date, default: Date.now },
  image: {
    data: Buffer,
    contentType: String
  }
})
export type User = {
  user: string,
  password: string,
  updatedAt?: Date,
  image: {
    data: Buffer,
    contentType: String
  }
}

