# ClassifiDev - API Backend

API RESTful serverless para anúncios classificados, feita com Next.js 14 Pages Router, TypeScript, MongoDB Atlas e Mongoose. O projeto não contém interface de produto; `/api-doc` é a página técnica do Swagger UI.

## Tecnologias

- Node.js 20.19+, Next.js 14 e TypeScript
- MongoDB Atlas com conexão Mongoose reutilizada entre invocações
- Joi para validação de payloads e bcryptjs para hash de senhas
- JWT em cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção
- OpenAPI 3 com Swagger UI
- Jest em ambiente `node`

## Rotas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Público | Healthcheck da API |
| `POST` | `/api/auth/register` | Público | Cadastra usuário |
| `POST` | `/api/auth/login` | Público | Autentica e define `auth_token` |
| `POST` | `/api/auth/logout` | Público | Expira o cookie de sessão |
| `GET` | `/api/ads` | Público | Lista anúncios e sessão opcional |
| `POST` | `/api/ads` | Autenticado | Cria anúncio para o usuário do token |
| `GET` | `/api/ads/:id` | Público | Consulta anúncio |
| `PUT` | `/api/ads/:id` | Proprietário | Atualiza anúncio próprio |
| `DELETE` | `/api/ads/:id` | Proprietário | Exclui anúncio próprio |
| `GET` | `/api-doc` | Público | Swagger UI interativo |

## Configuração local

Requer Node.js 20.19 ou superior e uma instância MongoDB acessível. Copie `.env.example` para `.env.local`, substitua os valores de exemplo e use uma chave JWT aleatória e longa:

```env
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/classifidev?retryWrites=true&w=majority
JWT_SECRET=<segredo-aleatorio-longo>
```

Não versione `.env.local`. Se uma URI real tiver sido compartilhada ou publicada, revogue a senha correspondente no MongoDB Atlas e gere uma nova antes de configurar o ambiente.

```bash
npm install
npm run dev
```

A API estará disponível em `http://localhost:3000` e a documentação em `http://localhost:3000/api-doc`.

## Testes e build

```bash
npm test
npm run test:coverage
npm run lint
npm run build
```

## Deploy

Importe o repositório na Vercel e configure `MONGODB_URI` e `JWT_SECRET` nas variáveis de ambiente do projeto. O deploy usa o runtime padrão Next.js; valide `/api/health` e `/api-doc` após a publicação. Para indicar outro endereço da API na documentação, defina `NEXT_PUBLIC_API_URL`.
