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
      <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">Balances</p>
      <ul className="mb-6">
        {balances.map((b) => (
          <li
            key={b.userId}
            className="flex justify-between items-baseline py-2 border-b border-dotted border-ink/20"
          >
            <span className="text-sm">{b.name}</span>
            <span
              className={`font-mono text-sm tabular-nums ${
                b.balance >= 0 ? 'text-forest' : 'text-rust'
              }`}
            >
              {b.balance >= 0
                ? `+₹${b.balance.toFixed(2)}`
                : `−₹${Math.abs(b.balance).toFixed(2)}`}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">Simplify Debts</p>
      {settlement.length === 0 ? (
        <p className="text-sm text-ink/50 italic">All settled up.</p>
      ) : (
        <ul>
          {settlement.map((t, i) => (
            <li key={i} className="flex justify-between items-baseline py-2 border-b border-dotted border-gold/50">
              <span className="text-sm">
                {t.fromName} → {t.toName}
              </span>
              <span className="font-mono text-sm tabular-nums text-gold">
                ₹{t.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Balances;