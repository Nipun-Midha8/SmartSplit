const prisma = require('./prismaClient');
const { simplifyDebts } = require('./settlementAlgorithm');

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

  const users = await prisma.user.findMany({
    where: { id: { in: Object.keys(balances) } },
  });

  const result = Object.entries(balances).map(([userId, balance]) => {
    const user = users.find((u) => u.id === userId);
    return { userId, name: user?.name || 'Unknown', balance };
  });

  res.json(result);
}

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

  const userIds = [...new Set(transactions.flatMap((t) => [t.from, t.to]))];
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } });

  const result = transactions.map((t) => ({
    ...t,
    fromName: users.find((u) => u.id === t.from)?.name || 'Unknown',
    toName: users.find((u) => u.id === t.to)?.name || 'Unknown',
  }));

  res.json(result);
}

module.exports = { getGroupBalances, getGroupSettlement };