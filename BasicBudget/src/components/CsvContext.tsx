import React, { createContext, ReactNode, useContext, useState } from "react";

interface CsvContextType {
  transactionData: string[][];
  setTransactionData: (data: string[][]) => void;
}

const CsvContext = createContext<CsvContextType | undefined>(undefined);

export const CsvProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transactionData, setTransactionData] = useState<string[][]>([]);

  return (
    <CsvContext.Provider
      value={{
        transactionData,
        setTransactionData,
      }}
    >
      {children}
    </CsvContext.Provider>
  );
};

export const useTransactions = (): CsvContextType => {
  const context = useContext(CsvContext);
  if (!context) {
    throw new Error("useTransactions must be used within a CsvProvider");
  }
  return context;
};
