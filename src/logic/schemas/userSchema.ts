import Joi from 'joi'

export const userRegistrationSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required().messages({
    'string.empty': 'O primeiro nome é obrigatório.',
    'string.max': 'O primeiro nome deve ter no máximo 50 caracteres.',
    'any.required': 'O primeiro nome é obrigatório.'
  }),
  lastName: Joi.string().trim().max(50).required().messages({
    'string.empty': 'O sobrenome é obrigatório.',
    'string.max': 'O sobrenome deve ter no máximo 50 caracteres.',
    'any.required': 'O sobrenome é obrigatório.'
  }),
  user: Joi.string().trim().max(30).required().messages({
    'string.empty': 'O nome de usuário é obrigatório.',
    'string.max': 'O nome de usuário deve ter no máximo 30 caracteres.',
    'any.required': 'O nome de usuário é obrigatório.'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'O email é obrigatório.',
    'string.email': 'Informe um email válido.',
    'any.required': 'O email é obrigatório.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'A senha é obrigatória.',
    'string.min': 'A senha deve conter no mínimo 6 caracteres.',
    'any.required': 'A senha é obrigatória.'
  })
})

export const userLoginSchema = Joi.object({
  identifier: Joi.string().trim().required().messages({
    'string.empty': 'Informe seu email ou nome de usuário.',
    'any.required': 'O identificador é obrigatório.'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Informe sua senha.',
    'any.required': 'A senha é obrigatória.'
  })
})
