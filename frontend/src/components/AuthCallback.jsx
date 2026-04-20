import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setToken(token);
      navigate('/');
    } else {
      navigate('/?error=auth_failed');
    }
  }, [token, setToken, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#050505]">
      <div className="text-purple-400 animate-pulse text-lg">Authenticating...</div>
    </div>
  );
};

export default AuthCallback;
