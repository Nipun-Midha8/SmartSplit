const prisma = require('./prismaClient');

async function getGroupBalances(req, res) {
  const { groupId } = req.params;

  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: { shares: true },
  });

  const balances = {};

  for (const expense of expenses) {
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;

    for (const share of expense.shares) {
      balances[share.userId] = (balances[share.userId] || 0) - share.shareAmount;
    }
  }

  res.json(balances);
}

module.exports = { getGroupBalances };

const { simplifyDebts } = require('./settlementAlgorithm');

async function getGroupSettlement(req, res) {
  const { groupId } = req.params;

  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: { shares: true },
  });

  const balances = {};

  for (const expense of expenses) {
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;

    for (const share of expense.shares) {
      balances[share.userId] = (balances[share.userId] || 0) - share.shareAmount;
    }
  }

  const transactions = simplifyDebts(balances);
  res.json(transactions);
}

module.exports = { getGroupBalances, getGroupSettlement };