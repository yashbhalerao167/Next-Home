import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json("User has been logged out!", {
            status: 200,
        });
        response.cookies.set("access_token", "", {
            httpOnly: true,
            expires: new Date(0),
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
