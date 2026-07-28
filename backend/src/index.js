require('dotenv').config();
const { signup, login } = require('./authController');
const express = require('express');
const cors = require('cors');
const prisma = require('./prismaClient');
const app = express();
const requireAuth = require('./authMiddleware');
const { createGroup, getMyGroups, addMember } = require('./groupController');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server is alive'));

app.post('/expenses', requireAuth, async (req, res) => {
  const { groupId, amount, description } = req.body;
  const expense = await prisma.expense.create({
    data: { groupId, paidBy: req.userId, amount, description },
  });
  res.status(201).json(expense);
});

app.get('/expenses', requireAuth, async (req, res) => {
  const expenses = await prisma.expense.findMany();
  res.json(expenses);
});

app.listen(4000, () => console.log('Server running on port 4000'));
app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.post('/groups', requireAuth, createGroup);
app.get('/groups', requireAuth, getMyGroups);
app.post('/groups/:groupId/members', requireAuth, addMember);