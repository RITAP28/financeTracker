import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryExpense } from "@/lib/interface";
import { Progress } from "../ui/progress";

interface CategoryBreakdownProps {
  categories: CategoryExpense[];
  totalExpenses: number;
}

export function CategoryBreakdown({
  categories,
  totalExpenses,
}: CategoryBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };
  // Sort categories by amount (highest first)
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Expenses by category this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCategories.map((category) => {
            const percentage =
              totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;

            return (
              <div key={category.categoryId} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">
                      {category.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {formatCurrency(category.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  style={{
                    backgroundColor: "hsl(var(--secondary))",
                  }}
                />
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No category data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
