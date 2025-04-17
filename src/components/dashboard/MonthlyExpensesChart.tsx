import { ITransactionProps } from "@/lib/interface";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Type } from "@/lib/enums";

const MonthlyExpensesChart = ({
  allTransactions,
}: {
  allTransactions: ITransactionProps[];
}) => {
  const monthlyExpensesMap = allTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        name: new Date(transaction.date).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
        amount: 0,
      };
    }

    if (transaction.type === Type.expense) {
      acc[monthKey].amount += transaction.amount;
    }

    return acc;
  }, {} as Record<string, { name: string; amount: number }>);

  const formattedData = Object.values(monthlyExpensesMap).sort((a, b) => {
    const dateA = new Date(a.name);
    const dateB = new Date(b.name);
    return dateA.getTime() - dateB.getTime();
  });

  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0, // Optional: remove decimals
    }).format(value);
  };

  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[1.5rem]">Monthly Expenses</CardTitle>
        <CardDescription className="text-sm font-light">
          Your spending over the last few months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => [
                  formatTooltip(value),
                  "Expenses",
                ]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="amount"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyExpensesChart;
