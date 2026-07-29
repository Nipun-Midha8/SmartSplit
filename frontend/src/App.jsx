import { useState, useEffect } from 'react';
import Auth from './Auth';
import Groups from './Groups';
import Balances from './Balances';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  useEffect(() => {
    if (!token || !activeGroup) return;

    fetch(`http://localhost:4000/expenses?groupId=${activeGroup.id}`, {
  headers: { Authorization: `Bearer ${token}` },
})
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, [token, activeGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:4000/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        groupId: activeGroup.id,
        description,
        amount: Number(amount),
      }),
    });

    const newExpense = await res.json();
    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  if (!activeGroup) {
    return <Groups token={token} onSelectGroup={setActiveGroup} />;
  }

  return (
    <div>
      <h1>SmartSplit</h1>
      <p>
        Logged in as {user.name} — Group: {activeGroup.name}
      </p>
      <button onClick={() => setActiveGroup(null)}>Back to Groups</button>

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
      <Balances token={token} groupId={activeGroup.id} />
    </div>
  );
}

export default App;