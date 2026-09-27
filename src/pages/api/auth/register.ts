import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'

import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { userRegistrationSchema } from '@/logic/schemas/userSchema'

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Cadastra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, user, email, password]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               user: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Usuário criado com sucesso }
 *       400: { description: Dados de entrada inválidos }
 *       409: { description: Email ou usuário já cadastrado }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: `Método ${req.method} não permitido.` })
  }

  const { error, value } = userRegistrationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  })

  if (error) {
    return res.status(400).json({
      message: 'Dados de validação inválidos.',
      errors: error.details.map((detail) => detail.message)
    })
  }

  try {
    await dbConnect()

    const existingUser = await User.findOne({
      $or: [{ email: value.email }, { user: value.user }]
    })

    if (existingUser) {
      const message =
        existingUser.email === value.email
          ? 'Este email já está em uso.'
          : 'Este nome de usuário já está em uso.'
      return res.status(409).json({ message })
    }

    const hashedPassword = await hash(value.password, 12)
    const createdUser = await User.create({ ...value, password: hashedPassword })

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      userId: createdUser._id.toString()
    })
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return res.status(409).json({ message: 'Este email ou nome de usuário já está em uso.' })
    }
    console.error('Erro em register:', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}
