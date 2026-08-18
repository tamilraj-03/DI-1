import { useState, useEffect } from 'react';
import { weddingConfig } from '../weddingConfig';

const useGuestName = () => {
  const [guestName, setGuestName] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get(weddingConfig.guestParamKey);
    if (name) {
      // Capitalize first letter
      setGuestName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
    }
  }, []);

  return guestName;
};

export default useGuestName;
