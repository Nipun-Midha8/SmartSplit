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
    <div>
      <h2>Your Groups</h2>

      <form onSubmit={handleCreateGroup}>
        <input
          type="text"
          placeholder="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button type="submit">Create Group</button>
      </form>

      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            {group.name}
            <button onClick={() => onSelectGroup(group)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Groups;