// AuthPage.jsx
import React, { useState } from 'react';
import supabase from './supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}