import { NextResponse } from "next/server";
import User from "@/model/User";
import { DBConnect } from "@/utils/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect("/login?error=missing_token");
    }

    await DBConnect();

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.redirect("/login?error=invalid_token");
    }

    // Verify the user
    user.emailVerified = new Date();
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // Sign in the user automatically and redirect to home
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?verified=true`);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect("/login?error=verification_failed");
  }
}
