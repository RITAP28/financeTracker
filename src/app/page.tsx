"use client";

import { BudgetComparisonChart } from "@/components/budget/BudgetComparisonChart";
import CategoryPieChart from "@/components/categories/CategoryPieChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import MonthlyExpensesChart from "@/components/dashboard/MonthlyExpensesChart";
import RecentTransactionsList from "@/components/dashboard/RecentTransactionsList";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { Type } from "@/lib/enums";
import {
  BudgetComparison,
  CategoryExpense,
  IBudgetProps,
  ITransactionProps,
} from "@/lib/interface";
import { fetchAllTransactions } from "@/lib/queries";
import { formatMonth, publicURL } from "@/lib/utils";
import axios from "axios";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [budgetLoading, setBudgetLoading] = useState<boolean>(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const [budget, setBudget] = useState<IBudgetProps[]>([]);

  const [allTransactions, setAllTransactions] = useState<ITransactionProps[]>(
    []
  );
  const [displayBudgets, setDisplayBudgets] = useState<Record<string, number>>(
    {}
  );

  const expensesRef = useRef<ITransactionProps[]>([]);
  const incomesRef = useRef<ITransactionProps[]>([]);

  const [expenses, setExpenses] = useState<number>(0);
  const [incomes, setIncomes] = useState<number>(0);

  const [data, setData] = useState<BudgetComparison[]>([]);
  const det: CategoryExpense[] = [];

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

  const handleFetchBudget = useCallback(async () => {
    try {
      setBudgetLoading(true);
      setBudgetError(null);

      const budgetResponse = await axios.get(
        `${publicURL}/api/budget/get?month=${formatMonth(new Date())}`
      );
      if (budgetResponse.status === 200) {
        const arr = budgetResponse.data.data as IBudgetProps[];
        setBudget(budgetResponse.data.data);
        arr.map((a) => {
          setDisplayBudgets((prev) => ({
            ...prev,
            [a.category.id]: a.budgetAmount,
          }));
        });
        console.log("budget: ", budgetResponse.data.data);
      }
    } catch (error) {
      console.error("Error while fetching budget: ", error);
      setBudgetError("Failed to fetch the budget");
    } finally {
      setBudgetLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchTransactions();
    handleFetchBudget();
  }, [handleFetchTransactions, handleFetchBudget]);

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

  useEffect(() => {
    if (allTransactions && displayBudgets) {
      const updatedData: BudgetComparison[] = budget.map((b) => {
        const matchingTxn = allTransactions.find(
          (t) => t.category.id === b.category.id
        );

        return {
          categoryId: b.category.id,
          category: b.category.name,
          budgeted: b.budgetAmount,
          actual: matchingTxn?.amount ?? 0,
          color: matchingTxn?.category.color ?? "#cccccc", // fallback color
        };
      });

      setData(updatedData);
      allTransactions.map((t) => {
        det.push({
          categoryId: t.category.id,
          category: t.category.name,
          amount: t.amount,
          color: t.category.color,
        });
      });
    }
  }, [allTransactions, displayBudgets, budget]);

  if (budgetLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="">Loading...</p>
      </div>
    )
  }

  if (budgetError) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-red-500 text-sm font-semibold">
          {budgetError}
        </p>
      </div>
    )
  }

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-4">
        <div>
          <CategoryBreakdown
            categories={det}
            totalExpenses={expenses}
          />
        </div>
        <div>
          <CategoryPieChart allTransactions={allTransactions} />
        </div>
        <div>
          <BudgetComparisonChart data={data} />
        </div>
      </div>
    </div>
  );
}
