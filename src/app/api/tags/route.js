import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import Tag from "@/models/Tags";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await DBConnect();
    const tags = await Tag.find({ userId: session.user.id });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    await DBConnect();

    const tag = await Tag.create({
      ...data,
      userId: session.user.id
    });

    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
