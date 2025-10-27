
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, user } = useAuth();

  if (user) {
    switch (user.role) {
      case 'admin': return <Navigate to="/admin" />;
      case 'reception': return <Navigate to="/reception" />;
      case 'partner': return <Navigate to="/partner" />;
      default: return <Navigate to="/login" />;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Academy Portal</h2>
        <p className="text-center text-white/80 mb-8">Please sign in to continue</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-white block mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="fas fa-user text-white/50"></i>
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-white/30 text-white placeholder-white/70 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none transition"
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password-input" className="text-sm font-medium text-white block mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="fas fa-lock text-white/50"></i>
              </span>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-white/30 text-white placeholder-white/70 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none transition"
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          {error && <p className="text-red-300 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-indigo-600 font-bold py-3 rounded-lg hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
