import transactions from "@/models/transactions";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { transactionId, newDescription } = await req.json();
        const existingTransaction = await transactions.findById(transactionId);
        if (!existingTransaction) return NextResponse.json({ success: false, message: "Missing transaction from db" }, { status: 400 });

        const editResponse = await transactions.updateOne(
            {  _id: transactionId  },
            {  $set: {  description: newDescription  } }
        );

        if (editResponse.modifiedCount === 0) return NextResponse.json({ success: false, message: "Transaction not edited successfully" }, { status: 500 });
        return NextResponse.json({ success: true, message: "Transaction updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error while editing the transaction: ", error);
        return NextResponse.json({ success: false, message: "Failed to edit the transaction" }, { status: 500 });
    }
}