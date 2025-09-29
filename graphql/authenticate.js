const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo-super-seguro';

function getUserFromToken(authHeader) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { getUserFromToken };
