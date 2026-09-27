import type { NextApiRequest, NextApiResponse } from 'next'

import dbConnect from '@/lib/mongoose'
import { getAuthenticatedUser } from '@/lib/auth'
import { serializeAd } from '@/lib/serialize'
import { adPayloadSchema } from '@/logic/schemas/adSchema'
import Ad from '@/models/Ad'
import User from '@/models/User'

/**
 * @swagger
 * /api/ads:
 *   get:
 *     tags: [Anúncios]
 *     summary: Lista anúncios e dados opcionais da sessão
 *     responses:
 *       200: { description: Lista retornada com sucesso }
 *   post:
 *     tags: [Anúncios]
 *     summary: Cria um anúncio (requer autenticação)
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, description, category, whatsapp]
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               category: { type: string }
 *               whatsapp: { type: number }
 *     responses:
 *       201: { description: Anúncio criado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autorizado }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ message: `Método ${req.method} não permitido.` })
  }

  try {
    await dbConnect()

    if (req.method === 'GET') {
      const authenticatedUser = getAuthenticatedUser(req)
      const ads = await Ad.find({}).sort({ date: -1 }).lean()

      let userInfo = null
      if (authenticatedUser?.userId) {
        const user = await User.findById(authenticatedUser.userId).select('firstName').lean()
        if (user) {
          userInfo = { firstName: user.firstName }
        }
      }

      return res.status(200).json({
        ads: ads.map(serializeAd),
        userId: authenticatedUser?.userId ?? null,
        userInfo
      })
    }

    const authenticatedUser = getAuthenticatedUser(req)
    if (!authenticatedUser) {
      return res.status(401).json({ message: 'Não autorizado.' })
    }

    const { error, value } = adPayloadSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({
        message: 'Dados do anúncio inválidos.',
        errors: error.details.map((detail) => detail.message)
      })
    }

    const ad = await Ad.create({ ...value, userId: authenticatedUser.userId })
    return res.status(201).json(serializeAd(ad))
  } catch (error) {
    console.error('Erro em /api/ads:', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}
