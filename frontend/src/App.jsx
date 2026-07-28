import { useState, useEffect } from 'react';

// Temporary hardcoded values until we build login/group selection
const TEMP_USER_ID = '05dca91d-f7f2-4c3f-9ed9-ac4b28e36f25';
const TEMP_GROUP_ID = '7a0933bc-497d-4c82-837b-f4d69dfe4eb3';

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
      body: JSON.stringify({
        groupId: TEMP_GROUP_ID,
        paidBy: TEMP_USER_ID,
        description,
        amount: Number(amount),
      }),
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