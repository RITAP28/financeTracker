import connectDB from "@/lib/db";
import transactions from "@/models/transactions";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const transactionId = req.nextUrl.pathname.split("/").pop();

        if (!transactionId) return NextResponse.json({ success: false, message: "Missing Transaction ID" }, { status: 400 });
        const existingTransaction = await transactions.findById(transactionId);
        if (!existingTransaction) return NextResponse.json({ success: false, message: "Missing Transaction from db" }, { status: 404 });

        const result = await transactions.deleteOne({
            _id: transactionId
        });

        if (result.deletedCount === 0) return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
        return NextResponse.json({ success: true, message: "Transaction deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error while deleting a transaction from db: ", error);
        return NextResponse.json({ success: false, message: "Failed to delete the transaction" }, { status: 500 });
    };
};