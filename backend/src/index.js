const express = require('express');
const cors = require('cors');
const prisma = require('./prismaClient');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server is alive'));

app.post('/expenses', async (req, res) => {
  const { groupId, paidBy, amount, description } = req.body;
  const expense = await prisma.expense.create({
    data: { groupId, paidBy, amount, description },
  });
  res.status(201).json(expense);
});

app.get('/expenses', async (req, res) => {
  const expenses = await prisma.expense.findMany();
  res.json(expenses);
});

app.listen(4000, () => console.log('Server running on port 4000'));