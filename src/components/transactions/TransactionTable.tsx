import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICategoryProps, ITransactionProps } from "@/lib/interface";
import { formatDate } from "@/lib/utils";
import { Status, Type } from "@/lib/enums";
import { SquarePen, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import EditTransaction from "../forms/editTransaction";

const TransactionTable = ({
  allTransactions,
  handleFetchTransactions,
  editDialogOpen,
  setEditDialogOpen,
  closeModal,
  allCategories,
  handleDeleteTransactions,
}: {
  allTransactions: ITransactionProps[];
  handleFetchTransactions: () => Promise<void>;
  editDialogOpen: boolean;
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void;
  allCategories: ICategoryProps[];
  handleDeleteTransactions: (transactionId: string) => Promise<void>;
}) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransactionProps | null>(null);
  return (
    <div className="w-full pt-4">
      <Table className="border-[0.5px] border-slate-200 rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] border-r-[0.5px] text-center">
              Date
            </TableHead>
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
                  <button
                    type="button"
                    className="hover:cursor-pointer hover:bg-slate-300 p-1 rounded-md transition duration-200 ease-in-out"
                    onClick={() => {
                      console.log("button clicked: ", transaction);
                      setEditDialogOpen(true);
                      setSelectedTransaction(transaction);
                    }}
                  >
                    <SquarePen className="w-4 h-4" />
                  </button>
                  <Dialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                  >
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
                        {selectedTransaction && (
                          <EditTransaction
                            transaction={selectedTransaction}
                            handleFetchTransactions={handleFetchTransactions}
                            closeModal={() => {
                              closeModal();
                              setSelectedTransaction(null);
                            }}
                            allCategories={allCategories}
                          />
                        )}
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
  );
};

export default TransactionTable;
