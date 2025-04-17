import connectDB from "@/lib/db";
import categories from "@/models/categories";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, color } = await req.json();
        if (!name || !color) {
            return NextResponse.json({ success: false, message: "Both fields required" }, { status: 400 })
        }
        // const existingCategory = await categories.findOne({
        //     name: name
        // });
        // if (existingCategory) {
        //     return NextResponse.json({ success: false, message: "Category already exists" }, { status: 400 });
        // };

        const newCategory = await categories.create({
            name: name,
            color: color
        });

        return NextResponse.json({ success: true, message: "New category added", data: newCategory }, { status: 200 });
    } catch (error) {
        console.error("Error while adding a new category: ", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}