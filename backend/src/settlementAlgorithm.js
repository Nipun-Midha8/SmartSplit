function simplifyDebts(balances) {
  const EPSILON = 0.01;

  const debtors = [];
  const creditors = [];

  for (const [userId, balance] of Object.entries(balances)) {
    if (balance < -EPSILON) {
      debtors.push({ userId, amount: -balance });
    } else if (balance > EPSILON) {
      creditors.push({ userId, amount: balance });
    }
  }

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settledAmount = Math.round(Math.min(debtor.amount, creditor.amount) * 100) / 100;

    if (settledAmount > EPSILON) {
      transactions.push({ from: debtor.userId, to: creditor.userId, amount: settledAmount });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount <= EPSILON) i++;
    if (creditor.amount <= EPSILON) j++;
  }

  return transactions;
}

module.exports = { simplifyDebts };