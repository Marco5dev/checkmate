import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";
import { DBConnect } from "@/utils/mongodb";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await DBConnect();
    const { name, username, description } = await request.json();

    // Check if username is taken
    const existingUser = await User.findOne({
      username,
      _id: { $ne: session.user.id }
    });

    if (existingUser) {
      return NextResponse.json({ 
        message: "Username already taken", 
        errors: { username: "This username is already taken" }
      }, { status: 409 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { name, username, description } },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      username: updatedUser.username,
      description: updatedUser.description,
      avatar: updatedUser.avatar
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
