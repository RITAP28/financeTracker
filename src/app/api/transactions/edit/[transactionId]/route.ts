import categories from "@/models/categories";
import transactions from "@/models/transactions";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { transactionId: string } }
) {
  try {
    const { amount, description, category, type, date } = await req.json();
    const transactionId = context.params.transactionId;

    const existingCategory = await categories.findOne({ name: category });
    const existingTransaction = await transactions.findById(transactionId);
    if (!existingTransaction || !existingCategory)
      return NextResponse.json(
        { success: false, message: "Missing transaction or category from db" },
        { status: 400 }
      );

    const editResponse = await transactions.updateOne(
      { _id: transactionId },
      {
        $set: {
          amount: amount,
          description: description,
          category: existingCategory._id,
          type: type,
          date: date,
        },
      }
    );

    if (editResponse.modifiedCount === 0)
      return NextResponse.json(
        { success: false, message: "Transaction not edited successfully" },
        { status: 500 }
      );
    return NextResponse.json(
      { success: true, message: "Transaction updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while editing the transaction: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to edit the transaction" },
      { status: 500 }
    );
  }
}
