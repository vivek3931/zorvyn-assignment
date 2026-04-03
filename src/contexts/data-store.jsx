import { createContext, useContext, useState, useCallback } from "react";
import {
  INITIAL_TRANSACTIONS,
  computeSummary,
  computeMonthlyTrend,
  computeCategoryBreakdown,
  computeTopInsights,
} from "@/lib/mock-data";

const DataStoreContext = createContext(undefined);

let nextId = INITIAL_TRANSACTIONS.length + 1;

export function DataStoreProvider({ children }) {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  const addTransaction = useCallback((t) => {
    setTransactions(prev => [{ ...t, id: nextId++ }, ...prev]);
  }, []);

  const updateTransaction = useCallback((id, changes) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...changes } : tx));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }, []);

  const summary = computeSummary(transactions);
  const monthlyTrend = computeMonthlyTrend(transactions);
  const categoryBreakdown = computeCategoryBreakdown(transactions);
  const topInsights = computeTopInsights(transactions);

  return (
    <DataStoreContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      summary,
      monthlyTrend,
      categoryBreakdown,
      topInsights,
    }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be inside DataStoreProvider");
  return ctx;
}
