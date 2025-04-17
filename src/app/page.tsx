"use client";

import MonthlyExpensesChart from "@/components/dashboard/MonthlyExpensesChart";
import RecentTransactionsList from "@/components/dashboard/RecentTransactionsList";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { Type } from "@/lib/enums";
import { ITransactionProps } from "@/lib/interface";
import { fetchAllTransactions } from "@/lib/queries";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [allTransactions, setAllTransactions] = useState<ITransactionProps[]>(
    []
  );
  const expensesRef = useRef<ITransactionProps[]>([]);
  const incomesRef = useRef<ITransactionProps[]>([]);

  const [expenses, setExpenses] = useState<number>(0);
  const [incomes, setIncomes] = useState<number>(0);

  const handleFetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAllTransactions();
      if (response.status === 200) {
        setAllTransactions(response.data.data);
      }
    } catch (error) {
      console.error("Error while fetching all transactions: ", error);
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchTransactions();
  }, [handleFetchTransactions]);

  useEffect(() => {
    if (allTransactions && allTransactions.length > 0) {
      expensesRef.current = allTransactions.filter(
        (t) => t.type === Type.expense
      );
      incomesRef.current = allTransactions.filter(
        (t) => t.type === Type.income
      );

      setExpenses(
        expensesRef.current.reduce((acc, curr) => acc + curr.amount, 0)
      );
      setIncomes(
        incomesRef.current.reduce((acc, curr) => acc + curr.amount, 0)
      );
    }
  }, [allTransactions]);

  // const totalExpenses = expensesRef.current.reduce((acc, curr) => acc + curr.amount, 0);
  // const totalIncomes = incomesRef.current.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="w-full px-8 py-4 min-h-screen">
      <div className="w-full leading-tight">
        <p className="font-bold text-[2rem] tracking-tight">Dashboard</p>
        <p className="font-light text-slate-400 text-sm">
          Get a summary of your financial activities and insights.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
        <SummaryCard
          title="Total Balance"
          value={incomes - expenses}
          icon={<DollarSign className="w-4 h-4" />}
          textColor="text-black"
        />
        <SummaryCard
          title="Total Expenses"
          value={expenses}
          icon={<ArrowDown className="w-4 h-4" />}
          textColor="text-red-500"
        />
        <SummaryCard
          title="Total Income"
          value={incomes}
          icon={<ArrowUp className="w-4 h-4" />}
          textColor="text-green-500"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
        <div className="col-span-2">
          <MonthlyExpensesChart allTransactions={allTransactions} />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactionsList
            allTransactions={allTransactions}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
