import { Schema } from 'mongoose'

export const userSchema = new Schema({
  user: { type: 'string', unique: true },
  password: { type: 'string' },
  updatedAt: { type: Date, default: Date.now }
})


