import { connectDB } from "@/lib/db";
import transactions from "@/models/transactions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const { amount, description, category, type, date } = await req.json();

  const newTxn = await transactions.create({
    amount,
    date,
    description,
    category,
    status: "Done",
    type,
  });

  return NextResponse.json({ success: true, data: newTxn });
}
