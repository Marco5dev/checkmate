import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Already logged out" },
        { status: 200 }
      );
    }

    // Clear the session
    request.cookies.clear("next-auth.session-token");
    request.cookies.clear("next-auth.csrf-token");

    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        status: 200,
        headers: {
          "Clear-Site-Data": '"cookies", "storage"',
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Error during logout" },
      { status: 500 }
    );
  }
}
