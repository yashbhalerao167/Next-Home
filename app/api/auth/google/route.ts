import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, name, photo } = await req.json();
        let user = await User.findOne({ email });

        if (!user) {
            const generatedPassword =
                Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const username =
                (name ? name.split(" ").join("").toLowerCase() : "user") +
                Math.random().toString(36).slice(-4);

            user = new User({
                username,
                email,
                password: hashedPassword,
                avatar: photo || "",
                isGoogleUser: true,
            });
            await user.save();
        } else {
            // Even if user exists, ensure isGoogleUser is true if they sign in via Google
            if (!user.isGoogleUser) {
                user.isGoogleUser = true;
                await user.save();
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
        const { password: hashedPassword, ...rest } = user._doc;

        const response = NextResponse.json(rest, { status: 200 });
        response.cookies.set("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000),
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
