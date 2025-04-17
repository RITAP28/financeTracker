"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BudgetComparison,
  IBudgetProps,
  ITransactionProps,
} from "@/lib/interface";
import axios from "axios";
import { formatMonth } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { BudgetComparisonChart } from "@/components/budget/BudgetComparisonChart";

interface ICategoryProps {
  _id: string;
  name: string;
  color: string;
  createdAt: Date;
}

const Budget = () => {
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [budgetLoading, setBudgetLoading] = useState<boolean>(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const [transactionError, setTransationError] = useState<string | null>(null);

  const [saveBudgetLoading, setSaveBudgetLoading] = useState<boolean>(false);
  const [saveBudgetError, setSaveBudgetError] = useState<string | null>(null);

  const [allCategories, setAllCategories] = useState<ICategoryProps[]>([]);
  const [allTransactions, setAllTransactions] = useState<ITransactionProps[]>(
    []
  );
  const [budget, setBudget] = useState<IBudgetProps[]>([]);

  const [data, setData] = useState<BudgetComparison[]>([]);

  // Combined state for displaying and editing budgets
  const [displayBudgets, setDisplayBudgets] = useState<Record<string, number>>(
    {}
  );

  const handleBudgetChange = (id: string, name: string, value: string) => {
    const numericValue = value === "" ? 0 : Number(value);

    // Update the display budgets for immediate UI feedback
    setDisplayBudgets((prev) => ({
      ...prev,
      [id]: numericValue,
    }));

    // Update the edited budgets for saving later
    setBudget((prevBudget) => {
      const existing = prevBudget.find((b) => b.category.id === id);

      if (existing) {
        return prevBudget.map((b) =>
          b.category.id === id ? { ...b, budgetAmount: numericValue } : b
        );
      } else {
        return [
          ...prevBudget,
          {
            category: { id, name },
            month: formatMonth(new Date()),
            budgetAmount: numericValue,
          },
        ];
      }
    });
  };

  const handleFetchAllTransactions = useCallback(async () => {
    try {
      setTransactionLoading(false);
      setTransationError(null);

      const response = await axios.get(
        `http://localhost:3000/api/transactions/all`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("categories: ", response.data);
      if (response.status === 200) {
        console.log("categories: ", response.data.data);
        setAllTransactions(response.data.data);
      }
    } catch (error) {
      console.error("Error while fetching all transactions: ", error);
      setTransationError("Failed to fetch all transactions");
    } finally {
      setTransactionLoading(false);
    }
  }, []);

  const handleFetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      const response = await axios.get(
        `http://localhost:3000/api/category/all`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("categories: ", response.data);
      if (response.status === 200) {
        console.log("categories: ", response.data.data);
        setAllCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error while fetching all transactions: ", error);
      setCategoriesError("Failed to fetch all transactions");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const handleFetchBudget = useCallback(async () => {
    try {
      setBudgetLoading(true);
      setBudgetError(null);

      const budgetResponse = await axios.get(
        `http://localhost:3000/api/budget/get?month=${formatMonth(new Date())}`
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
    handleFetchAllTransactions();
    handleFetchCategories();
    handleFetchBudget();
  }, [handleFetchAllTransactions, handleFetchCategories, handleFetchBudget]);

  const handleSaveBudget = async () => {
    try {
      setSaveBudgetLoading(true);
      setSaveBudgetError(null);

      const saveResponse = await axios.put(
        `http://localhost:3000/api/budget/create`,
        {
          budgets: budget,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (saveResponse.status === 200) {
        console.log("edited budget: ", saveResponse.data);
        await handleFetchBudget();
      }
    } catch (error) {
      console.error("Error while saving budget: ", error);
      setSaveBudgetError("Failed to save budget");
    } finally {
      setSaveBudgetLoading(false);
    }
  };

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
    }
  }, [allTransactions, displayBudgets, budget]);

  if (categoriesLoading || budgetLoading || transactionLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="">Loading...</p>
      </div>
    );
  }

  if (budgetError) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-red-500 text-sm font-semibold">{budgetError}</p>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-red-500 text-sm font-semibold">{categoriesError}</p>
      </div>
    );
  }

  if (transactionError) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-red-500 text-sm font-semibold">{transactionError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
        <p className="text-muted-foreground">
          Set and manage your monthly spending budgets by category.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocations</CardTitle>
            <CardDescription>
              Set your monthly budget for each category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allCategories
                .filter((cat) => cat.name !== "Income") // Don't budget for income
                .map((category, index) => {
                  const budgetValue =
                    displayBudgets[category._id] !== undefined
                      ? displayBudgets[category._id]
                      : "";
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <Label htmlFor={`budget-${category._id}`}>
                          {category.name}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`budget-${category._id}`}
                          type="number"
                          min="0"
                          step="10"
                          value={budgetValue}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleBudgetChange(
                              category._id,
                              category.name,
                              e.target.value
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              {saveBudgetError && (
                <div className="w-full flex justify-center items-center">
                  <p className="text-red-500 font-semibold text-sm">
                    {saveBudgetError}
                  </p>
                </div>
              )}
              {saveBudgetLoading ? (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Please Wait...
                </Button>
              ) : (
                <Button onClick={handleSaveBudget} className="w-full mt-6">
                  Save Budgets
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <BudgetComparisonChart data={data} />
      </div>
    </div>
  );
};

export default Budget;
