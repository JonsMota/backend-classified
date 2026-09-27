import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'O primeiro nome é obrigatório.'],
      maxlength: 50,
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'O sobrenome é obrigatório.'],
      maxlength: 50,
      trim: true
    },
    user: {
      type: String,
      required: [true, 'O nome de usuário é obrigatório.'],
      maxlength: 30,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'O email é obrigatório.'],
      maxlength: 100,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória.']
    }
  },
  {
    timestamps: true
  }
)

export default models.User || model('User', UserSchema)
