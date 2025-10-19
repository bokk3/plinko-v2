import React, { createContext, useRef, useCallback } from 'react';

type CreditsContextType = {
  refreshCredits: () => void;
  setRefreshCredits: (fn: () => void) => void;
};

export const CreditsContext = createContext<CreditsContextType>({
  refreshCredits: () => {},
  setRefreshCredits: () => {},
});

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const refreshRef = useRef<() => void>(() => {});

  const setRefreshCredits = useCallback((fn: () => void) => {
    refreshRef.current = fn;
  }, []);

  const refreshCredits = useCallback(() => {
    refreshRef.current();
  }, []);

  return (
    <CreditsContext.Provider value={{ refreshCredits, setRefreshCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

// Hook for Navbar to register its refresh function
export function useRegisterCreditsRefresh(fn: () => void) {
  const { setRefreshCredits } = React.useContext(CreditsContext);
  React.useEffect(() => {
    setRefreshCredits(fn);
  }, [fn, setRefreshCredits]);
}
