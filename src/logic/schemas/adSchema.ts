import Joi from 'joi'

export const adPayloadSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'O nome do anúncio é obrigatório.',
    'any.required': 'O nome do anúncio é obrigatório.'
  }),
  category: Joi.string().trim().required().messages({
    'string.empty': 'A categoria é obrigatória.',
    'any.required': 'A categoria é obrigatória.'
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'O preço deve ser um valor numérico.',
    'number.positive': 'O preço deve ser maior que zero.',
    'any.required': 'O preço é obrigatório.'
  }),
  whatsapp: Joi.number().integer().positive().required().messages({
    'number.base': 'O número de WhatsApp deve ser numérico.',
    'any.required': 'O WhatsApp é obrigatório.'
  }),
  description: Joi.string().trim().required().messages({
    'string.empty': 'A descrição é obrigatória.',
    'any.required': 'A descrição é obrigatória.'
  })
})
