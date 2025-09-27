const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretdemo';

router.post('/register', (req, res) => {
  const { username, password, favorecido } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Informe usuário e senha' });
  const result = userService.registerUser({ username, password, favorecido });
  if (result.error) return res.status(409).json(result);
  res.status(201).json(result);
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Informe usuário e senha' });
  const result = userService.loginUser({ username, password });
  if (result.error) return res.status(401).json(result);
  const token = jwt.sign({ username: result.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json(result);
});

router.get('/', (req, res) => {
  res.json(userService.getUsers());
});

module.exports = router;
