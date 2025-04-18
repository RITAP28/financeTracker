import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CategoryExpense, ITransactionProps } from "@/lib/interface";

const CategoryPieChart = ({ allTransactions }: { allTransactions: ITransactionProps[] }) => {
  const data: CategoryExpense[] = [];

  allTransactions.forEach((t) => {
    data.push({
      categoryId: t.category.id,
      category: t.category.name,
      amount: t.amount,
      color: t.category.color,
    });
  });

  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl">
          Expenses by Category
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          How your spending is distributed across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                // innerRadius={40}
                dataKey="amount"
                nameKey="category"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatTooltip(value), "Amount"]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>  
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
