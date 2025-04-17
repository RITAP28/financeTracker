"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate, publicURL } from "@/lib/utils";
import axios from "axios";
import { Loader2, SquarePen, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditTransaction from "@/components/forms/editTransaction";
import { ICategoryProps, ITransactionProps } from "@/lib/interface";
import { Status, Type } from "@/lib/enums";

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

      const response = await axios.get(
        `${publicURL}/api/category/all`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
          <p className="w-full">
            View and manage all your financial transactions
          </p>
        </div>
        <div className="items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="hover:cursor-pointer">Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>
                <div className="">
                  <p className="font-semibold">Add Transaction</p>
                  <p className="font-light text-sm text-slate-500">
                    Enter the details for your new transaction
                  </p>
                </div>
              </DialogTitle>
              <form
                onSubmit={handleSubmit}
                className="space-y-2 p-2 w-full mx-auto"
              >
                <div>
                  <Label htmlFor="amount" className="mb-2">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="mb-2 mt-2">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2 mt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Add a description"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="mb-2 mt-2">
                    Category
                  </Label>
                  <Select
                    onValueChange={(value) => handleChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((c, index) => (
                        <SelectItem value={c.name} key={index}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 mt-2">Type</Label>
                  <RadioGroup
                    defaultValue="Expense"
                    onValueChange={(value) => handleChange("type", value)}
                    className="flex space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Expense" id="expense" />
                      <Label htmlFor="expense">Expense</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Income" id="income" />
                      <Label htmlFor="income">Income</Label>
                    </div>
                  </RadioGroup>
                </div>
                {loading ? (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Please Wait...
                  </Button>
                ) : (
                  <Button type="submit" className="w-full mt-2">
                    Add
                  </Button>
                )}
              </form>
              <DialogFooter className="sm:justify-start">
                {/* <DialogClose asChild>
                    <button type="button" className="">
                      Close
                    </button>
                  </DialogClose> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="w-full pt-4">
        <Table className="border-[0.5px] border-slate-200 rounded-xl">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] border-r-[0.5px] text-center">Date</TableHead>
              <TableHead className="text-center border-r-[0.5px]">
                Description
              </TableHead>
              <TableHead className="text-center border-r-[0.5px]">
                Category
              </TableHead>
              <TableHead className="text-center border-r-[0.5px]">
                Amount
              </TableHead>
              <TableHead className="text-center border-r-[0.5px]">
                Status
              </TableHead>
              <TableHead className="text-center border-r-[0.5px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTransactions.map((transaction, index) => (
              <TableRow key={index} className="text-black">
                <TableCell className="font-medium border-r-[0.5px] text-center">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell className="text-center border-r-[0.5px]">
                  {transaction.description}
                </TableCell>
                <TableCell className="text-center border-r-[0.5px]">
                  {transaction.category.name}
                </TableCell>
                <TableCell className="text-center border-r-[0.5px] font-semibold">
                  {transaction.type === Type.income ? (
                    <p className="text-green-400">₹{transaction.amount}</p>
                  ) : (
                    <p className="text-red-400">₹{transaction.amount}</p>
                  )}
                </TableCell>
                <TableCell className="text-center border-r-[0.5px] font-semibold">
                  {transaction.status === Status.processing ? (
                    <p className="text-yellow-600 bg-yellow-400">
                      {transaction.status}
                    </p>
                  ) : transaction.status === Status.done ? (
                    <button
                      type="button"
                      className="text-green-600 bg-green-200 px-4 py-1 rounded-md"
                    >
                      {transaction.status}
                    </button>
                  ) : (
                    <p className="text-red-500">{transaction.status}</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="w-full flex flex-row gap-2 items-center justify-center">
                    <Dialog
                      open={editDialogOpen}
                      onOpenChange={setEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="hover:cursor-pointer hover:bg-slate-300 p-1 rounded-md transition duration-200 ease-in-out"
                          onClick={() => {
                            console.log("button clicked: ", transaction);
                          }}
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            <div className="leading-tight">
                              <p className="font-semibold">Edit Transaction</p>
                              <p className="font-light text-sm">
                                Make changes to the transaction details.
                              </p>
                            </div>
                          </DialogTitle>
                          <EditTransaction
                            transaction={transaction}
                            handleFetchTransactions={handleFetchTransactions}
                            closeModal={closeModal}
                          />
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <button
                      type="button"
                      className="hover:cursor-pointer hover:bg-red-200 p-1 rounded-md transition ease-in-out duration-200 text-red-400"
                      onClick={() => {
                        handleDeleteTransactions(transaction._id);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* {addTransactionModal && <AddTransaction />} */}
    </div>
  );
}
