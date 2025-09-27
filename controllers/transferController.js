const express = require('express');
const router = express.Router();
const transferService = require('../services/transferService');

router.post('/', (req, res) => {
  const { from, to, value } = req.body;
  if (!from || !to || typeof value !== 'number') return res.status(400).json({ error: 'Dados obrigatórios: from, to, value (number)' });
  const result = transferService.transfer({ from, to, value });
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});

router.get('/', (req, res) => {
  res.json(transferService.getTransfers());
});

module.exports = router;
