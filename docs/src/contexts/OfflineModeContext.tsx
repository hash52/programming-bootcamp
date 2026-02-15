import React, { createContext, useContext } from "react";
import { useLocalStorage } from "react-use";

interface OfflineModeContextValue {
  isOffline: boolean;
  toggleOffline: () => void;
}

const defaultValue: OfflineModeContextValue = {
  isOffline: false,
  toggleOffline: () => {},
};

const OfflineModeContext = createContext<OfflineModeContextValue>(defaultValue);

export const OfflineModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOffline, setIsOffline] = useLocalStorage(
    "onecompiler-offline-mode",
    false,
  );

  const toggleOffline = () => setIsOffline(!isOffline);

  return (
    <OfflineModeContext.Provider
      value={{ isOffline: isOffline ?? false, toggleOffline }}
    >
      {children}
    </OfflineModeContext.Provider>
  );
};

export const useOfflineMode = () => useContext(OfflineModeContext);
