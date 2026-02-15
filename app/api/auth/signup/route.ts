import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, password, email } = await req.json();
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();
        return NextResponse.json("User created successfully", { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
