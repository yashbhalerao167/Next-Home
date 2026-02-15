import { NextResponse } from "next/server";
import Listing from "@/models/Listing";
import dbConnect from "@/lib/mongodb";
import { verifyToken } from "@/utils/verifyToken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
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
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await req.json();
        const listing = new Listing(data);
        await listing.save();
        return NextResponse.json(listing, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
