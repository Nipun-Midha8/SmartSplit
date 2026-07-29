import { useState } from 'react';

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isSignup ? '/auth/signup' : '/auth/login';
    const body = isSignup ? { name, email, password } : { email, password };

    const res = await fetch(`http://localhost:4000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    onLogin(data.token, data.user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-5xl font-semibold text-forest text-center mb-1">
          SmartSplit
        </h1>
        <p className="text-center text-ink/50 text-sm mb-8 tracking-wide uppercase">
          {isSignup ? 'Create an account' : 'Welcome back'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b border-ink/20 bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-forest transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-ink/20 bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-forest transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b border-ink/20 bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-forest transition-colors"
          />
          <button
            type="submit"
            className="mt-4 bg-forest text-paper rounded-full px-5 py-2.5 text-sm font-medium hover:bg-forest-dark transition-colors"
          >
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        {error && <p className="text-rust text-sm mt-4 text-center">{error}</p>}

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="w-full mt-6 text-sm text-ink/50 hover:text-forest transition-colors"
        >
          {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default Auth;