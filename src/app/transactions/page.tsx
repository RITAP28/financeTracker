"use client";

import { publicURL } from "@/lib/utils";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ICategoryProps, ITransactionProps } from "@/lib/interface";
import TransactionTable from "@/components/transactions/TransactionTable";
import AddTransactionForm from "@/components/transactions/AddTransactionForm";

export default function Transactions() {
  const [allTransactions, setAllTransactions] = useState<ITransactionProps[]>(
    []
  );

  // ADD TRANSACTION STATES
  const [loading, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);

  // FETCH TRANSACTION STATES
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  const [allCategories, setAllCategories] = useState<ICategoryProps[]>([]);

  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
    type: "Expense",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFetchTransactions = useCallback(async () => {
    try {
      setFetchLoading(true);
      setFetchError(null);

      const response = await axios.get(`${publicURL}/api/transactions/all`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("transactions: ", response.data);
      if (response.status === 200) {
        console.log("transactions: ", response.data.data);
        setAllTransactions(response.data.data);
      }
    } catch (error) {
      console.error("Error while fetching all transactions: ", error);
      setFetchError("Failed to fetch all transactions");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.amount || isNaN(Number(formData.amount))) {
      alert("Please enter a valid amount");
      return;
    }

    console.log("Form Data:", formData);
    try {
      const response = await axios.post(
        `${publicURL}/api/transactions/add`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Successfully added a transaction");
        await handleFetchTransactions();
        setFormData({
          amount: "",
          date: "",
          description: "",
          category: "",
          type: "Expense",
        });
      }
    } catch (error) {
      console.error("Error while adding a new transaction: ", error);
      setError("Failed to add a transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchTransactions();
  }, [handleFetchTransactions]);

  const closeModal = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteTransactions = async (transactionId: string) => {
    try {
      console.log("transactionId: ", transactionId);
      const deleteResponse = await axios.delete(
        `${publicURL}/api/transactions/delete/${transactionId}`
      );

      if (deleteResponse.status === 200) {
        await handleFetchTransactions();
      }
    } catch (error) {
      console.error("Error while deleting a transaction: ", error);
    }
  };

  const handleGetAllCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${publicURL}/api/category/all`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("all categories fetched successfully");
        setAllCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error while fetching all categories: ", error);
      setError("Failed to fetch all categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetAllCategories();
  }, [handleGetAllCategories]);

  return fetchLoading ? (
    <div className="w-full flex justify-center items-center">
      <p className="">Loading...</p>
    </div>
  ) : fetchError ? (
    <div className="w-full flex justify-center items-center">
      <p className="">{fetchError}</p>
    </div>
  ) : (
    <div className="w-full px-10 leading-tight">
      <div className="w-full flex justify-between items-center">
        <div className="">
          <p className="font-bold text-[2rem] pt-6 w-full">Transactions</p>
          <p className="w-full text-sm font-light">
            View and manage all your financial transactions
          </p>
        </div>
        <AddTransactionForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formData={formData}
          allCategories={allCategories}
          loading={loading}
        />
      </div>

      <TransactionTable
        allTransactions={allTransactions}
        handleFetchTransactions={handleFetchTransactions}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        closeModal={closeModal}
        allCategories={allCategories}
        handleDeleteTransactions={handleDeleteTransactions}
      />
      {/* {addTransactionModal && <AddTransaction />} */}
    </div>
  );
}
