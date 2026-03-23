import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple helper: redirect to main feed where users/watch reels
const PartnerReels = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect partners to the public feed so they can view reels
    navigate('/');
  }, [navigate]);

  return null;
};

export default PartnerReels;
