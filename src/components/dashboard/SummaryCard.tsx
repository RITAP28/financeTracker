import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  textColor?: string;
}

const SummaryCard = ({ title, value, icon, textColor } : SummaryCardProps) => {
  return (
    <Card className="rounded-md hover:shadow-lg transition ease-in-out duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textColor}`}>
          ₹{value}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
