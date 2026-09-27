import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

import dbConnect from '@/lib/mongoose'
import { getAuthenticatedUser } from '@/lib/auth'
import { serializeAd } from '@/lib/serialize'
import { adPayloadSchema } from '@/logic/schemas/adSchema'
import Ad from '@/models/Ad'

/**
 * @swagger
 * /api/ads/{id}:
 *   get:
 *     tags: [Anúncios]
 *     summary: Busca anúncio por ID (público)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Detalhes do anúncio }
 *       400: { description: ID inválido }
 *       404: { description: Anúncio não encontrado }
 *   put:
 *     tags: [Anúncios]
 *     summary: Atualiza anúncio próprio
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: Anúncio atualizado }
 *       400: { description: Dados inválidos }
 *       401: { description: Não autenticado }
 *       403: { description: Usuário não é o proprietário }
 *   delete:
 *     tags: [Anúncios]
 *     summary: Exclui anúncio próprio
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Anúncio removido }
 *       401: { description: Não autenticado }
 *       403: { description: Usuário não é o proprietário }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de anúncio inválido.' })
  }

  if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).json({ message: `Método ${req.method} não permitido.` })
  }

  try {
    await dbConnect()

    if (req.method === 'GET') {
      const ad = await Ad.findById(id).lean()
      if (!ad) {
        return res.status(404).json({ message: 'Anúncio não encontrado.' })
      }
      return res.status(200).json(serializeAd(ad))
    }

    const authenticatedUser = getAuthenticatedUser(req)
    if (!authenticatedUser) {
      return res.status(401).json({ message: 'Não autorizado.' })
    }

    if (req.method === 'PUT') {
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

      const updatedAd = await Ad.findOneAndUpdate(
        { _id: id, userId: authenticatedUser.userId },
        value,
        { new: true, runValidators: true }
      ).lean()

      if (!updatedAd) {
        return res.status(403).json({ message: 'Você não tem permissão para editar este anúncio.' })
      }
      return res.status(200).json(serializeAd(updatedAd))
    }

    const deletedAd = await Ad.findOneAndDelete({
      _id: id,
      userId: authenticatedUser.userId
    })

    if (!deletedAd) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir este anúncio.' })
    }
    return res.status(204).end()
  } catch (error) {
    console.error('Erro em /api/ads/[id]:', error)
    return res.status(500).json({ message: 'Erro interno no servidor.' })
  }
}
