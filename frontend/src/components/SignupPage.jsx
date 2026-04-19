import React, { useState, useContext } from 'react';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register, redirectToGoogleAuth } from '../api/auth';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');

    try {
      const data = await register(name, email, password);
      setToken(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#050505] transition-colors duration-200 text-gray-900 dark:text-gray-200">
      <div className="bg-white dark:bg-[#0f0f13] border border-gray-200 dark:border-gray-800 transition-colors duration-200 rounded-2xl w-full max-w-md p-8 shadow-sm dark:shadow-[0_0_50px_rgba(124,58,237,0.1)] relative">
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-3xl font-bold font-display text-gray-900 dark:text-white transition-colors mb-2">Create Account</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors mb-8">Join DevMentor AI to unlock intelligent coding mentorship.</p>

        {error && <p className="text-rose-500 text-sm mb-4 bg-rose-500/10 p-2 rounded">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#15151e] transition-colors border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-500 rounded-lg p-3 pl-11 text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-[#15151e] transition-colors border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-500 rounded-lg p-3 pl-11 text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input type="password" placeholder="Password (min 6 chars)" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-[#15151e] transition-colors border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-500 rounded-lg p-3 pl-11 text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <button type="submit" className="w-full py-3 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
            Sign Up
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 dark:bg-gray-800 transition-colors flex-1"></div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">or</span>
          <div className="h-px bg-gray-200 dark:bg-gray-800 transition-colors flex-1"></div>
        </div>

        <button onClick={redirectToGoogleAuth} className="mt-6 w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex justify-center items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-gray-600 dark:text-gray-400 transition-colors text-sm mt-6">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  );
};
export default SignupPage;
