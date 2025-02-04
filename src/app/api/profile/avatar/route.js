import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import User from "@/models/User";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await DBConnect();
    const { filename, contentType, base64 } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          avatar: {
            filename,
            contentType,
            base64,
            updatedAt: new Date()
          }
        }
      },
      { new: true }
    ).lean();

    return NextResponse.json({
      avatar: updatedUser.avatar
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
