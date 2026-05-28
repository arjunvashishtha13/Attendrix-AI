import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const OAuthCallback = () => {
  const [params] = useSearchParams();
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      setToken(token).then(() => navigate('/dashboard'));
    } else {
      navigate('/login');
    }
  }, [params, setToken, navigate]);

  return <LoadingSpinner fullScreen label="Completing sign in..." />;
};

export default OAuthCallback;
