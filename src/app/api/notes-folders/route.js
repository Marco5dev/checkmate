import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import NotesFolder from "@/models/NotesFolder";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await DBConnect();
    const folders = await NotesFolder.find({ userId: session.user.id })
                                   .sort({ createdAt: -1 });

    return NextResponse.json(folders);
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

    const folder = await NotesFolder.create({
      ...data,
      userId: session.user.id
    });

    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
