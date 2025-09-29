const users = require('../models/userModel');
const transfers = require('../models/transferModel');
/*
function transfer({ from, to, value }) {
  const sender = users.find(u => u.username === from);
  const recipient = users.find(u => u.username === to);
  if (!sender || !recipient) return { error: 'Usuário remetente ou destinatário não encontrado' };
  if (sender.saldo < value) return { error: 'Saldo insuficiente' };
  if (!recipient.favorecido && value >= 5000) {
    return { error: 'Transferência acima de R$ 5.000,00 só para favorcideos' };
  }
  sender.saldo -= value;
  recipient.saldo += value;
  const transfer = { from, to, value, date: new Date() };
  transfers.push(transfer);
  return transfer;
}

function getTransfers() {
  return transfers;
}

module.exports = { transfer, getTransfers };*/
function transfer({ from, to, value }) {
  if (typeof value !== 'number' || value <= 0) {
    return { error: 'Valor inválido para transferência' };
  }

  if (!Array.isArray(users)) {
    return { error: 'Base de usuários não inicializada' };
  }

  const sender = users.find(u => u.username === from);
  const recipient = users.find(u => u.username === to);

  if (!sender || !recipient) {
    return { error: 'Usuário remetente ou destinatário não encontrado' };
  }

  if (sender.saldo < value) {
    return { error: 'Saldo insuficiente' };
  }

  if (!recipient.favorecido && value >= 5000) {
    return { error: 'Transferência acima de R$ 5.000,00 só para favorecidos' };
  }

  sender.saldo -= value;
  recipient.saldo += value;
  const transfer = { from, to, value, date: new Date() };
  transfers.push(transfer);
  return transfer;
}
function getTransfers() {
  return transfers;
}

module.exports = { transfer, getTransfers };
