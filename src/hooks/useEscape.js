import { useEffect } from 'react';

export function useEscape(enabled, onEscape) {
  useEffect(() => {
    if (!enabled) return undefined;
    const handler = (event) => {
      if (event.key === 'Escape') onEscape?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, onEscape]);
}
