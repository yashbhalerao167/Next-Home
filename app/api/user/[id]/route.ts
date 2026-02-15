import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { verifyToken } from "@/utils/verifyToken";
import { cookies } from "next/headers";
import bcryptjs from "bcryptjs";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        const { password, ...rest } = user._doc;
        return NextResponse.json(rest, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Use POST for update as per original route /update/:id
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        const { id } = await params;
        if (!decoded || decoded.id !== id) {
            return NextResponse.json(
                { success: false, message: "You can only update your own account" },
                { status: 401 }
            );
        }

        const data = await req.json();
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (data.password) {
            if (user.isGoogleUser) {
                return NextResponse.json(
                    { success: false, message: "Google users cannot change password" },
                    { status: 400 }
                );
            }
            if (!data.currentPassword) {
                return NextResponse.json(
                    { success: false, message: "Current password is required to change password" },
                    { status: 400 }
                );
            }
            const isMatch = bcryptjs.compareSync(data.currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json(
                    { success: false, message: "Incorrect current password" },
                    { status: 401 }
                );
            }
            data.password = bcryptjs.hashSync(data.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    username: data.username || user.username,
                    email: data.email || user.email,
                    password: data.password || user.password,
                    avatar: data.avatar || user.avatar,
                },
            },
            { new: true }
        );

        const { password: hashedPassword, ...rest } = updatedUser._doc;
        return NextResponse.json(rest, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        const { id } = await params;
        if (!decoded || decoded.id !== id) {
            return NextResponse.json(
                { success: false, message: "You can only delete your own account" },
                { status: 401 }
            );
        }

        await User.findByIdAndDelete(id);
        const response = NextResponse.json("User has been deleted", { status: 200 });
        response.cookies.set("access_token", "", { expires: new Date(0) });
        return response;
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
