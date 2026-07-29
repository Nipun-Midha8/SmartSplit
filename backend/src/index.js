require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prismaClient');
const requireAuth = require('./authMiddleware');
const { signup, login } = require('./authController');
const { createGroup, getMyGroups, addMember } = require('./groupController');
const { getGroupBalances, getGroupSettlement } = require('./balanceController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server is alive'));

app.post('/auth/signup', signup);
app.post('/auth/login', login);

app.post('/groups', requireAuth, createGroup);
app.get('/groups', requireAuth, getMyGroups);
app.post('/groups/:groupId/members', requireAuth, addMember);
app.get('/groups/:groupId/balances', requireAuth, getGroupBalances);
app.get('/groups/:groupId/settlement', requireAuth, getGroupSettlement);

app.post('/expenses', requireAuth, async (req, res) => {
  const { groupId, amount, description } = req.body;

  const members = await prisma.groupMember.findMany({ where: { groupId } });
  const splitAmount = amount / members.length;

  const expense = await prisma.expense.create({
    data: {
      groupId,
      paidBy: req.userId,
      amount,
      description,
      shares: {
        create: members.map((member) => ({
          userId: member.userId,
          shareAmount: splitAmount,
        })),
      },
    },
    include: { shares: true },
  });

  res.status(201).json(expense);
});

app.get('/expenses', requireAuth, async (req, res) => {
  const { groupId } = req.query;
  const expenses = await prisma.expense.findMany({
    where: { groupId },
  });
  res.json(expenses);
});

app.listen(4000, () => console.log('Server running on port 4000'));