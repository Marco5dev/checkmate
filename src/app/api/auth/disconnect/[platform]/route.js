import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import User from "@/model/User";
import { DBConnect } from "@/utils/mongodb";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await DBConnect();
    const { platform } = params;
    const user = await User.findById(session.user.id);

    // Check if trying to disconnect initial provider without password
    if (user.provider === platform && user.password_changes === 0) {
      return NextResponse.json(
        { error: "Cannot disconnect primary login method without setting a password first" },
        { status: 400 }
      );
    }

    // Remove the platform from connectedPlatforms array
    user.connectedPlatforms = user.connectedPlatforms.filter(
      p => p.provider !== platform
    );

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
