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
    const data = await request.json();

    // First check if email or username already exists
    const existingUserByEmail = await User.findOne({
      email: data.email,
      _id: { $ne: session.user.id }
    });

    const existingUserByUsername = await User.findOne({
      username: data.username,
      _id: { $ne: session.user.id }
    });

    const errors = {};
    if (existingUserByEmail) {
      errors.email = "This email is already in use";
    }
    if (existingUserByUsername) {
      errors.username = "This username is already taken";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ 
        message: "Validation failed", 
        errors 
      }, { status: 409 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          name: data.name,
          email: data.email,
          username: data.username,
        },
      },
      { new: true, runValidators: true }
    ).lean();

    // Serialize the response
    const serializedUser = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      avatar: updatedUser.avatar ? {
        base64: updatedUser.avatar.base64,
        contentType: updatedUser.avatar.contentType
      } : null,
      provider: updatedUser.provider,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt?.toISOString(),
      updatedAt: updatedUser.updatedAt?.toISOString()
    };

    return NextResponse.json(serializedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
