import connectDB from "@/lib/db";
import categories from "@/models/categories";
import transactions from "@/models/transactions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { amount, description, category, type, date } = await req.json();

    const existingCategory = await categories.findOne({
      name: category,
    });
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category does not exist" },
        { status: 404 }
      );
    }

    const newTxn = await transactions.create({
      amount,
      date,
      description,
      category: {
        id: existingCategory._id,
        name: existingCategory.name,
        color: existingCategory.color
      },
      status: "Done",
      type,
    });

    const txn = await transactions.findById(newTxn._id).populate("category");
    return NextResponse.json({ success: true, message: "transaction saved successfully", data: txn }, { status: 200 });
  } catch (error) {
    console.error("Error while sending post request: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
