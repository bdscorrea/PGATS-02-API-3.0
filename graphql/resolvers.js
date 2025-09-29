const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const transferService = require('../services/transferService');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo-super-seguro';

module.exports = {
  Query: {
    users: () => userService.getUsers(),
    transfers: () => transferService.getTransfers(),
  },
  Mutation: {
    register: (_, { username, password, favorecido }) => {
      const result = userService.registerUser({ username, password, favorecido });
      if (result.error) throw new Error(result.error);
      return result;
    },
    login: (_, { username, password }) => {
      const result = userService.loginUser({ username, password });
      if (result.error) throw new Error(result.error);
      const token = jwt.sign({ username: result.username }, JWT_SECRET, { expiresIn: '1h' });
      return { user: result, token };
    },
    transfer: (_, { from, to, value }, { user }) => {
      if (!user) throw new Error('Autenticação obrigatória');
      const result = transferService.transfer({ from, to, value });
      if (result.error) throw new Error(result.error);
      return result;
    },
  },
};
