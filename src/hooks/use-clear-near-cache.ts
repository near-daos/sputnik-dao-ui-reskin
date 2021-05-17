import { useEffect } from 'react';

const STORAGE_KEY = 'SPUTNIK_DAO_IS_CLEARED';

const useClearNearCache = (): void => {
  useEffect(() => {
    const keys = Object.keys(localStorage);
    const isCleared = Boolean(
      JSON.parse(localStorage.getItem(STORAGE_KEY) || 'false'),
    );

    if (!isCleared) {
      keys.forEach((key) => {
        if (key.indexOf('near-api-js:') !== -1) {
          localStorage.removeItem(key);
        }

        if (key.indexOf('wallet_auth_key') !== -1) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(true));
    }
  }, []);
};

export default useClearNearCache;
