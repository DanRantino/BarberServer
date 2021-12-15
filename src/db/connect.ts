import mongoose from 'mongoose'
import { userSchema } from '../models/userModel'

export default async function connectMongo() {
  await mongoose.connect('mongodb://user:user@localhost:27017/testedb?authSource=admin')
  const db = await mongoose.connection
  mongoose.model('User', userSchema)
}
