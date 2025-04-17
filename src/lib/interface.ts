import { Status, Type } from "./enums";

export interface ITransactionProps {
  _id: string;
  amount: number;
  date: string;
  status: Status;
  description: string;
  category: {
    id: string;
    name: string;
    color: string
  };
  type: Type;
}

export type MonthlyExpense = {
  month: string;
  amount: number;
};

export type CategoryExpense = {
  categoryId: string;
  category: string;
  amount: number;
  color: string;
};

export interface ICategoryProps {
  name: string;
  color: string;
  createdAt: Date;
}
