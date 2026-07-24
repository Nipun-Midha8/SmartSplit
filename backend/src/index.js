const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let expenses = [];

app.get('/', (req, res) => res.send('Server is alive'));

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

app.get('/expenses', (req, res) => {
  res.json(expenses);
});

app.listen(4000, () => console.log('Server running on port 4000'));