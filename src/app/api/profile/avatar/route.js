import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import User from "@/model/User";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await DBConnect();
    const { avatar } = await request.json();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.avatar = avatar;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Avatar update error:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}
