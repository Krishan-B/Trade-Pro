import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

const useIdleTimeout = (timeout: number) => {
  const { logout: signOut } = useAuth();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      signOut();
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    const reset = () => resetTimeout();

    events.forEach(event => window.addEventListener(event, reset));
    resetTimeout();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach(event => window.removeEventListener(event, reset));
    };
  }, [timeout, signOut]);
};

export default useIdleTimeout;