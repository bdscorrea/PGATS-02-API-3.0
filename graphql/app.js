const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { getUserFromToken } = require('./authenticate');

const app = express();
app.use(express.json());

const server = new ApolloServer({ typeDefs, resolvers });

async function startApollo() {
  await server.start();
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const user = getUserFromToken(req.headers['authorization']);
      return { user };
    }
  }));
}

startApollo();

module.exports = app;
