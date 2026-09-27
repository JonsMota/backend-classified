import type { NextApiRequest } from 'next'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: string
  email?: string
  firstName?: string
}

export function getAuthenticatedUser(req: NextApiRequest): AuthPayload | null {
  const token = req.cookies.auth_token
  const secret = process.env.JWT_SECRET

  if (!token || !secret) {
    return null
  }

  try {
    const payload = jwt.verify(token, secret)
    if (typeof payload === 'string' || typeof payload.userId !== 'string') {
      return null
    }
    return payload as AuthPayload
  } catch {
    return null
  }
}
