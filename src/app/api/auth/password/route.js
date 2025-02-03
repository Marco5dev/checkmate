import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await DBConnect();
    const { oldPassword, newPassword, isInitialSet } = await request.json();

    const user = await User.findById(session.user.id).select('+password +password_changes');

    // Verify old password if not initial set
    if (user.password_changes > 0 && !isInitialSet) {
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // Update password and increment password_changes
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.password_changes += 1;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
