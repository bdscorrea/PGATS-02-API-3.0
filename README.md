# API de Transferências, Usuários e GraphQL

Esta API permite realizar operações de registro, login, consulta de usuários e transferências de valores entre usuários, tanto via REST quanto via GraphQL.

## Tecnologias
- Node.js
- Express (v4)
- Apollo Server (v4)
- Swagger (documentação REST)
- JWT (autenticação)

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
2. Instale as dependências:
   ```bash
   npm install express@^4 @apollo/server@^4 @apollo/server-express4 jsonwebtoken bcryptjs
   ```

## Estrutura de Diretórios
- `controllers/` - Lógica das rotas REST
- `services/` - Regras de negócio
- `models/` - Dados em memória
- `graphql/` - API GraphQL (app.js e server.js)
- `app.js` - Configuração da aplicação REST
- `server.js` - Inicialização do servidor REST
- `swagger.json` - Documentação da API REST

## Como executar REST

```bash
node server.js
```
A API REST estará disponível em `http://localhost:3000`.

## Como executar GraphQL

```bash
node graphql/server.js
```
A API GraphQL estará disponível em `http://localhost:4000/graphql`.

## Documentação Swagger
Acesse [http://localhost:3000/api-docs](http://localhost:3000/api-docs) para visualizar e testar os endpoints REST via Swagger UI.

## Endpoints principais REST
- `POST /users/register` - Registrar novo usuário
- `POST /users/login` - Login de usuário
- `GET /users` - Consultar todos os usuários
- `POST /transfer` - Realizar transferência
- `GET /transfer` - Consultar transferências

## GraphQL

Rode `npm run start-graphql` para executar a API do GraphQL e acesse a URL http://localhost:4000/graphql para acessá-la.

### Types
- `User`: username, favorecido, saldo
- `Transfer`: from, to, value, date
- `AuthPayload`: user, token

### Queries
- `users`: Lista de usuários
- `transfers`: Lista de transferências

### Mutations
- `register(username, password, favorecido)`: Cria usuário
- `login(username, password)`: Autentica usuário e retorna token
- `transfer(from, to, value)`: Realiza transferência (requer autenticação JWT)

## Autenticação nas Mutations
- Para realizar transferências via GraphQL, envie o token JWT no header `authorization`:
  ```
  { "authorization": "Bearer <token>" }
  ```
  O token é obtido via mutation `login`.

## Testes
Para automação de testes, importe o `app.js` (REST ou GraphQL) em seu teste (ex: com Supertest) sem executar o método `listen()`.

---

API desenvolvida para fins educacionais.