import connectDB from "@/lib/db";
import categories from "@/models/categories";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const allCategories = await categories.find();

        return NextResponse.json({ success: true, message: "Categories fetched successfully", data: allCategories }, { status: 200 });
    } catch (error) {
        console.error("Error while fetching all categories: ", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}