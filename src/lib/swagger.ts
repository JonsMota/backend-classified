import { createSwaggerSpec } from 'next-swagger-doc'

export function getApiDocs() {
  return createSwaggerSpec({
    apiFolder: 'src/pages/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ClassifiDev API Backend',
        version: '1.0.0',
        description: 'Documentação dos endpoints RESTful da plataforma ClassifiDev'
      },
      servers: [{ url: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000' }],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'auth_token'
          }
        }
      }
    }
  })
}
