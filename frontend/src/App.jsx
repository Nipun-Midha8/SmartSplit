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
    <div className="min-h-screen flex justify-center p-6">
      <div className="w-full max-w-md pt-12">
        <button
          onClick={() => setActiveGroup(null)}
          className="text-sm text-ink/50 hover:text-forest mb-6 transition-colors"
        >
          ← Groups
        </button>

        <h1 className="font-display text-3xl font-semibold mb-1">{activeGroup.name}</h1>
        <p className="text-sm text-ink/50 mb-8">{user.name}</p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border-b border-ink/20 bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-forest transition-colors"
          />
          <input
            type="number"
            placeholder="₹"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-20 border-b border-ink/20 bg-transparent px-1 py-2 text-sm font-mono focus:outline-none focus:border-forest transition-colors"
          />
          <button
            type="submit"
            className="bg-forest text-paper rounded-full px-4 py-2 text-sm font-medium hover:bg-forest-dark transition-colors"
          >
            Add
          </button>
        </form>

        <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">Expenses</p>
        <ul className="mb-8">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex justify-between items-baseline py-2 border-b border-dotted border-ink/20"
            >
              <span className="text-sm">{expense.description}</span>
              <span className="font-mono text-sm tabular-nums">₹{expense.amount}</span>
            </li>
          ))}
        </ul>

        <Balances token={token} groupId={activeGroup.id} />
      </div>
    </div>
  );
}

export default App;