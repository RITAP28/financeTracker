import connectDB from "@/lib/db";
import transactions from "@/models/transactions";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { transactionId: string } }) {
    try {
        await connectDB();
        const transactionId = params.transactionId;

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
        return NextResponse.json({ sucess: false, message: "Failed to delete the transaction" }, { status: 500 });
    };
};