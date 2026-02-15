import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return NextResponse.json(
                { success: false, message: "Invalid password" },
                { status: 400 }
            );
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET!);
        const { password: hashedPassword, ...user } = validUser._doc;

        const response = NextResponse.json(user, { status: 200 });

        response.cookies.set("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000), // 1 hour
            path: "/",
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
