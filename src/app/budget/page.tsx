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
import { ICategoryProps } from "@/lib/interface";
import axios from "axios";

const Budget = () => {
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [editedBudgets, setEditedBudgets] = useState({});

  const [allCategories, setAllCategories] = useState<ICategoryProps[]>([]);

  const handleBudgetChange = (categoryId: string, value: string) => {
    setEditedBudgets({
      ...editedBudgets,
      [categoryId]: parseFloat(value) || 0
    });
  };

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

  useEffect(() => {
    handleFetchCategories();
  }, [handleFetchCategories]);

  return (
    <div className="space-y-6">
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
                .map((category) => {
                  const budgetAmount = editedBudgets[category.id] || 0;
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <Label htmlFor={`budget-${category.id}`}>
                          {category.name}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`budget-${category.id}`}
                          type="number"
                          min="0"
                          step="10"
                          value={budgetAmount}
                          onChange={(e) =>
                            handleBudgetChange(category.id, e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              {/* <Button onClick={handleSaveBudgets} className="w-full mt-6">
                Save Budgets
              </Button> */}
            </div>
          </CardContent>
        </Card>

        {/* <BudgetComparisonChart data={budgetComparison} /> */}
      </div>
    </div>
  );
};

export default Budget;
