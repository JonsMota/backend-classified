import jwt from 'jsonwebtoken'
import { serializeAd } from '@/lib/serialize'
import { adPayloadSchema } from '@/logic/schemas/adSchema'

describe('Testes unitários de backend', () => {
  const testSecret = 'segredo_padrao_para_bateria_de_testes_backend'

  describe('Geração e validação de tokens JWT', () => {
    it('assina e verifica um payload válido', () => {
      const payload = { userId: 'user_id_123', email: 'dev@classifidev.com' }
      const token = jwt.sign(payload, testSecret, { expiresIn: '1h' })
      const decoded = jwt.verify(token, testSecret) as typeof payload

      expect(decoded.userId).toBe('user_id_123')
      expect(decoded.email).toBe('dev@classifidev.com')
    })

    it('rejeita tokens assinados com chave incorreta', () => {
      const forgedToken = jwt.sign({ userId: 'hacker' }, 'chave_incorreta')
      expect(() => jwt.verify(forgedToken, testSecret)).toThrow()
    })
  })

  describe('Serialização de anúncios', () => {
    it('mapeia _id do MongoDB para id no contrato REST', () => {
      const result = serializeAd({
        _id: '507f1f77bcf86cd799439011',
        name: 'Monitor Ultrawide',
        price: 1800,
        description: 'Em perfeito estado',
        category: 'Informática',
        whatsapp: 11999999999,
        date: new Date('2025-01-01'),
        userId: '507f1f77bcf86cd799439012'
      })

      expect(result.id).toBe('507f1f77bcf86cd799439011')
      expect(result.name).toBe('Monitor Ultrawide')
      expect(result.userId).toBe('507f1f77bcf86cd799439012')
      expect(result).not.toHaveProperty('_id')
    })
  })

  describe('Validação de schemas Joi', () => {
    it('rejeita preço zero ou negativo', () => {
      const { error } = adPayloadSchema.validate({
        name: 'Notebook',
        category: 'Informática',
        price: -50,
        whatsapp: 41999999999,
        description: 'Usado'
      })

      expect(error).toBeDefined()
    })

    it('aceita todos os campos obrigatórios válidos', () => {
      const { error } = adPayloadSchema.validate({
        name: 'Notebook',
        category: 'Informática',
        price: 2500,
        whatsapp: 41999999999,
        description: 'Notebook de trabalho'
      })

      expect(error).toBeUndefined()
    })

    it('remove campos que não pertencem ao schema quando solicitado', () => {
      const { value } = adPayloadSchema.validate(
        {
          name: 'Notebook',
          category: 'Informática',
          price: 2500,
          whatsapp: 41999999999,
          description: 'Notebook de trabalho',
          userId: 'forjado'
        },
        { stripUnknown: true }
      )

      expect(value).not.toHaveProperty('userId')
    })
  })
})