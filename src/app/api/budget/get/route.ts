import { connectDB } from "@/lib/db";
import budget from "@/models/budget";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const month = searchParams.get("month");
      const result = await budget.find({ month });
      return NextResponse.json({ success: true, message: "Categories fetched successfully", data: result }, { status: 200 });
    } catch (error) {
      console.error("Error fetching budgets:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }