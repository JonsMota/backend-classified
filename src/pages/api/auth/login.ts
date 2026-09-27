import type { NextApiRequest, NextApiResponse } from 'next'
import { compare } from 'bcryptjs'
import { serialize } from 'cookie'
import { sign } from 'jsonwebtoken'

import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { userLoginSchema } from '@/logic/schemas/userSchema'

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Autentica o usuário e define o cookie HttpOnly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login bem-sucedido }
 *       400: { description: Dados inválidos }
 *       401: { description: Credenciais inválidas }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: `Método ${req.method} não permitido.` })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ message: 'JWT_SECRET não está configurado no servidor.' })
  }

  const { error, value } = userLoginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  })

  if (error) {
    return res.status(400).json({
      message: 'Dados inválidos.',
      errors: error.details.map((detail) => detail.message)
    })
  }

  try {
    await dbConnect()

    const user = await User.findOne({
      $or: [{ email: value.identifier.toLowerCase() }, { user: value.identifier }]
    })

    if (!user || !(await compare(value.password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas.' })
    }

    const token = sign(
      {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName
      },
      secret,
      { expiresIn: '1h' }
    )

    res.setHeader(
      'Set-Cookie',
      serialize('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60,
        path: '/'
      })
    )

    return res.status(200).json({ message: 'Login realizado com sucesso.' })
  } catch (error) {
    console.error('Erro em login:', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}
