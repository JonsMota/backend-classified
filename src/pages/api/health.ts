import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Monitoramento
 *     summary: Retorna o status de saúde da API
 *     responses:
 *       200: { description: Serviço operacional }
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: `Método ${req.method} não permitido.` })
  }

  return res.status(200).json({
    status: 'ok',
    service: 'classifidev-backend',
    timestamp: new Date().toISOString()
  })
}
