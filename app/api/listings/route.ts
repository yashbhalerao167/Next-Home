import { NextResponse } from "next/server";
import Listing from "@/models/Listing";
import dbConnect from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);

        const limit = parseInt(searchParams.get("limit") || "9");
        const startIndex = parseInt(searchParams.get("startIndex") || "0");

        let offer: any = searchParams.get("offer");
        if (offer === null || offer === "false") {
            offer = { $in: [false, true] };
        } else {
            offer = offer === "true";
        }

        let furnished: any = searchParams.get("furnished");
        if (furnished === null || furnished === "false") {
            furnished = { $in: [false, true] };
        } else {
            furnished = furnished === "true";
        }

        let parking: any = searchParams.get("parking");
        if (parking === null || parking === "false") {
            parking = { $in: [false, true] };
        } else {
            parking = parking === "true";
        }

        let type: any = searchParams.get("type");
        if (type === null || type === "all") {
            type = { $in: ["sale", "rent"] };
        }

        const searchTerm = searchParams.get("searchTerm") || "";
        const sort = searchParams.get("sort") || "createdAt";
        const order = searchParams.get("order") || "desc";

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: "i" },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order === "desc" ? -1 : 1 })
            .limit(limit)
            .skip(startIndex);

        return NextResponse.json(listings, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
