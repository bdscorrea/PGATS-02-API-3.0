/*const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secretdemo';

function authenticateToken(req, res, next) {
    const authHeader = req.headers('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Token não fornecido.'})
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({mesagge: 'Token inválido.'});
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
*/

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secretdemo';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET); // ✅ direto com jwt
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authenticateToken;