import React, { createContext, useContext, useState, ReactNode } from "react";

interface BlankInputContextType {
  blanks: Record<string, string>;
  updateBlank: (id: string, value: string) => void;
  resetBlanks: () => void;
  blankCorrectness: Record<string, boolean | undefined>;
  setBlankCorrectness: (correctness: Record<string, boolean>) => void;
}

const BlankInputContext = createContext<BlankInputContextType | undefined>(
  undefined
);

export const useBlankInput = () => {
  const context = useContext(BlankInputContext);
  if (!context) {
    throw new Error(
      "useBlankInput must be used within a BlankInputProvider"
    );
  }
  return context;
};

interface BlankInputProviderProps {
  children: ReactNode;
}

export const BlankInputProvider: React.FC<BlankInputProviderProps> = ({
  children,
}) => {
  const [blanks, setBlanks] = useState<Record<string, string>>({});
  const [blankCorrectness, setBlankCorrectness] = useState<
    Record<string, boolean | undefined>
  >({});

  const updateBlank = (id: string, value: string) => {
    setBlanks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const resetBlanks = () => {
    setBlanks({});
    setBlankCorrectness({});
  };

  return (
    <BlankInputContext.Provider
      value={{
        blanks,
        updateBlank,
        resetBlanks,
        blankCorrectness,
        setBlankCorrectness,
      }}
    >
      {children}
    </BlankInputContext.Provider>
  );
};
