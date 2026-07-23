const express = require('express');
const app = express();
app.use(express.json());

// fake in-memory "database" for now
let expenses = [];

app.get('/', (req, res) => res.send('Server is alive'));

// Create a new expense
app.post('/expenses', (req, res) => {
  const { description, amount } = req.body;
  const expense = {
    id: Date.now(),
    description,
    amount,
  };
  expenses.push(expense);
  res.status(201).json(expense);
});

// Get all expenses
app.get('/expenses', (req, res) => {
  res.json(expenses);
});

app.listen(4000, () => console.log('Server running on port 4000'));