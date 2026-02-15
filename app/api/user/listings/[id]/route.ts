import { NextResponse } from "next/server";
import Listing from "@/models/Listing";
import dbConnect from "@/lib/mongodb";
import { verifyToken } from "@/utils/verifyToken";
import { cookies } from "next/headers";

export async function GET(
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
                { success: false, message: "You can only view your own listings" },
                { status: 401 }
            );
        }

        const listings = await Listing.find({ userRef: id });
        return NextResponse.json(listings, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
