import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum ActiveButton {
    dashboard = "Dashboard",
    transactions = "Transactions",
    categories = "Categories",
    budget = "Budget"
}

export enum Type {
  expense = "Expense",
  income = "Income"
}

export enum Status {
  done = "Done",
  processing = "processing",
  failed = "failed"
}

export interface ITransactionProps {
  _id: string;
  amount: number;
  date: string;
  status: Status;
  description: string;
  category: string;
  type: Type
}
