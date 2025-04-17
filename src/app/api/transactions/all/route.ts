import connectDB from "@/lib/db";
import transactions from "@/models/transactions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const allTransactions = await transactions.find();
        return NextResponse.json({ success: true, message: "Transactions fetched successfully", data: allTransactions }, { status: 200 });
    } catch (error) {
        console.error("Error while fetching all transactions: ", error);
        return NextResponse.json({ success: false, message: "Failed to fetch all transactions" }, { status: 500 });
    }
}