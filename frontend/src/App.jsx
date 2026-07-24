import { useState, useEffect } from 'react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/expenses')
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:4000/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount: Number(amount) }),
    });

    const newExpense = await res.json();
    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
  };

  return (
    <div>
      <h1>SmartSplit</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} — ₹{expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;