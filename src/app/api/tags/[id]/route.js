import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import Tag from "@/models/Tags";

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    await DBConnect();
    
    const tag = await Tag.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      data,
      { new: true }
    );

    if (!tag) return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await DBConnect();
    const tag = await Tag.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    });

    if (!tag) return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
