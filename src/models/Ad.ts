import { Schema, model, models } from 'mongoose'

const AdSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome do anúncio é obrigatório.'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório.'],
      min: [0.01, 'O preço deve ser superior a zero.']
    },
    description: {
      type: String,
      required: [true, 'A descrição é obrigatória.'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'A categoria é obrigatória.'],
      trim: true
    },
    whatsapp: {
      type: Number,
      required: [true, 'O número de WhatsApp é obrigatório.']
    },
    date: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O proprietário do anúncio é obrigatório.']
    }
  },
  {
    timestamps: true
  }
)

export default models.Ad || model('Ad', AdSchema)
