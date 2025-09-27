# API de Transferências e Usuários

Esta API permite realizar operações de registro, login, consulta de usuários e transferências de valores entre usuários. O objetivo é servir de base para estudos de automação de testes de API.

## Tecnologias
- Node.js
- Express
- Swagger (documentação)

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
2. Instale as dependências:
   ```bash
   npm install express swagger-ui-express
   ```

## Estrutura de Diretórios
- `controllers/` - Lógica das rotas
- `services/` - Regras de negócio
- `models/` - Dados em memória
- `app.js` - Configuração da aplicação
- `server.js` - Inicialização do servidor
- `swagger.json` - Documentação da API

## Como executar

```bash
node server.js
```
A API estará disponível em `http://localhost:3000`.

## Documentação Swagger
Acesse [http://localhost:3000/api-docs](http://localhost:3000/api-docs) para visualizar e testar os endpoints via Swagger UI.

## Endpoints principais

- `POST /users/register` - Registrar novo usuário
- `POST /users/login` - Login de usuário
- `GET /users` - Consultar todos os usuários
- `POST /transfer` - Realizar transferência
- `GET /transfer` - Consultar transferências

## Regras de Negócio
- Não é permitido registrar usuários duplicados.
- Login exige usuário e senha (sem token).
- Transferências acima de R$ 5.000,00 só podem ser feitas para usuários marcados como "favorecido".
- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor.

## Testes
Para automação de testes, importe o `app.js` em seu teste (ex: com Supertest) sem executar o método `listen()`.

---

API desenvolvida para fins educacionais.