import { useState, useEffect } from 'react';

function Balances({ token, groupId }) {
  const [balances, setBalances] = useState([]);
  const [settlement, setSettlement] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/groups/${groupId}/balances`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setBalances);

    fetch(`http://localhost:4000/groups/${groupId}/settlement`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setSettlement);
  }, [token, groupId]);

  return (
    <div>
      <h3>Balances</h3>
      <ul>
        {balances.map((b) => (
          <li key={b.userId}>
            {b.name}: {b.balance >= 0 ? `is owed ₹${b.balance.toFixed(2)}` : `owes ₹${Math.abs(b.balance).toFixed(2)}`}
          </li>
        ))}
      </ul>

      <h3>Simplify Debts</h3>
      {settlement.length === 0 ? (
        <p>All settled up!</p>
      ) : (
        <ul>
          {settlement.map((t, i) => (
            <li key={i}>
              {t.fromName} pays {t.toName} ₹{t.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Balances;