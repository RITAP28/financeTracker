import { Status, Type } from "./enums";

export interface ITransactionProps {
  _id: string;
  amount: number;
  date: string;
  status: Status;
  description: string;
  category: string;
  type: Type;
}

export type MonthlyExpense = {
    month: string;
    amount: number;
}