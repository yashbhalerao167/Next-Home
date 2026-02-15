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
        const { id } = await params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return NextResponse.json(
                { success: false, message: "Listing not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(listing, { status: 200 });
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
    // POST for update as per original
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
        const listing = await Listing.findById(id);

        if (!listing) {
            return NextResponse.json(
                { success: false, message: "Listing not found" },
                { status: 404 }
            );
        }

        if (!decoded || decoded.id !== listing.userRef) {
            return NextResponse.json(
                { success: false, message: "You can only update your own listings" },
                { status: 401 }
            );
        }

        const data = await req.json();
        const updatedListing = await Listing.findByIdAndUpdate(id, data, {
            new: true,
        });
        return NextResponse.json(updatedListing, { status: 200 });
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
        const listing = await Listing.findById(id);

        if (!listing) {
            return NextResponse.json(
                { success: false, message: "Listing not found" },
                { status: 404 }
            );
        }

        if (!decoded || decoded.id !== listing.userRef) {
            return NextResponse.json(
                { success: false, message: "You can only delete your own listings" },
                { status: 401 }
            );
        }

        await Listing.findByIdAndDelete(id);
        return NextResponse.json({ message: "Listing deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
