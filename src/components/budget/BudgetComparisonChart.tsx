import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetComparison } from '@/lib/interface';

interface BudgetComparisonChartProps {
  data: BudgetComparison[];
}

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
    console.log("data: ", data);
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value}`;
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
        <CardTitle>Budget vs. Actual</CardTitle>
        <CardDescription>Compare your planned budget with actual spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatTooltip(value), 
                  name === 'budgeted' ? 'Budget' : 'Actual'
                ]}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                formatter={(value) => (value === 'budgeted' ? 'Budget' : 'Actual')}
              />
              <Bar 
                dataKey="budgeted" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar 
                dataKey="actual" 
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
