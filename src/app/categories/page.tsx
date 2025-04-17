"use client";

import CategoryPieChart from "@/components/categories/CategoryPieChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ICategoryProps, ITransactionProps } from "@/lib/interface";
import { publicURL } from "@/lib/utils";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const Categories = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [allTransactions, setAllTransactions] = useState<ITransactionProps[]>([]);
  const [allCategories, setAllCategories] = useState<ICategoryProps[]>([]);

  const handleFetchTransactions = useCallback(async () => {
    try {
        setLoading(true);
        setError(null);

      const response = await axios.get(
        `${publicURL}/api/transactions/all`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("transactions: ", response.data);
      if (response.status === 200) {
        console.log("transactions: ", response.data.data);
        setAllTransactions(response.data.data);
      }
    } catch (error) {
      console.error("Error while fetching all transactions: ", error);
      setError("Failed to fetch all transactions");
    } finally {
        setLoading(false);
    }
  }, []);

  const handleFetchCategories = useCallback(async () => {
    try {
        setCategoriesLoading(true);
        setCategoriesError(null);

      const response = await axios.get(
        `${publicURL}/api/category/all`,
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
    handleFetchTransactions();
    handleFetchCategories();
  }, [handleFetchTransactions, handleFetchCategories]);

  if (loading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-red-500 text-sm font-semibold">
          {categoriesError}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          View spending by category and manage your categories.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryPieChart allTransactions={allTransactions} />

        <Card>
          <CardHeader>
            <CardTitle>Available Categories</CardTitle>
            <CardDescription>
              List of categories for transaction classification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {allCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-md border-0 p-1"
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-${category.color}-400`}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categories;
