import { useState, useEffect } from 'react';

function Groups({ token, onSelectGroup }) {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/groups', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setGroups(data));
  }, [token]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:4000/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newGroupName }),
    });

    const newGroup = await res.json();
    setGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  return (
    <div className="min-h-screen flex justify-center p-6">
      <div className="w-full max-w-md pt-12">
        <h1 className="font-display text-4xl font-semibold text-forest text-center mb-1">
          SmartSplit
        </h1>
        <p className="text-center text-ink/50 text-sm mb-10 tracking-wide uppercase">
          Your Groups
        </p>

        <form onSubmit={handleCreateGroup} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="flex-1 border-b border-ink/20 bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-forest transition-colors"
          />
          <button
            type="submit"
            className="bg-forest text-paper rounded-full px-5 py-2 text-sm font-medium hover:bg-forest-dark transition-colors"
          >
            Create
          </button>
        </form>

        <ul>
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex justify-between items-baseline py-4 border-b border-dotted border-ink/25"
            >
              <span className="font-display text-lg">{group.name}</span>
              <button
                onClick={() => onSelectGroup(group)}
                className="text-sm text-forest hover:text-forest-dark font-medium transition-colors"
              >
                Open →
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Groups;