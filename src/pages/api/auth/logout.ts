import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Autenticação]
 *     summary: Invalida o cookie de sessão
 *     responses:
 *       200: { description: Logout realizado com sucesso }
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: `Método ${req.method} não permitido.` })
  }

  res.setHeader(
    'Set-Cookie',
    serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      maxAge: 0,
      path: '/'
    })
  )

  return res.status(200).json({ message: 'Logout realizado com sucesso.' })
}
