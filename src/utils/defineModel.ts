import mongoose, { Model, Schema } from 'mongoose'
import { userSchema } from '../models/userModel'
import { userType } from '../types/userType'

export default async function defineModel(model: string) {
  let schema: Schema
  if (model === 'user') {
    schema = userSchema
  }
  return function(): Model<userType> {
    return mongoose.model(model, schema)
  }
}
