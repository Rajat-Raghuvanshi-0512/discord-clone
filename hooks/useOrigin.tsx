import React, { useEffect, useState } from 'react';

const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false);
  const origin = typeof window === 'undefined' ? '' : window.location.origin;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return '';

  return origin;
};

export default useOrigin;
