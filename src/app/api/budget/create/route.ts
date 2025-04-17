import { connectDB } from "@/lib/db";
import { IBudgetProps } from "@/lib/interface";
import budget from "@/models/budget";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { budgets } : { budgets: IBudgetProps[] } = await req.json(); 
    // array of { category: { id, name }, month, budgetAmount }

    let newBudget: IBudgetProps = {
        category: {
            id: "",
            name: ""
        },
        month: "",
        budgetAmount: 0
    };

    for (const item of budgets) {
      const existing = await budget.findOne({
        "category.id": item.category.id,
        month: item.month,
      });

      if (existing) {
        existing.budgetAmount = item.budgetAmount;
        existing.createdAt = new Date();
        newBudget = await existing.save();
      } else {
        newBudget = await budget.create({
          ...item,
          createdAt: new Date(),
        });
      }
    }

    return NextResponse.json({ success: true, message: "Budgets saved/updated", data: newBudget }, { status: 200 });
  } catch (error) {
    console.error("Error saving budget:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
