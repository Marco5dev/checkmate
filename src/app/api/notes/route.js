import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import Notes from "@/models/Notes";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await DBConnect();
    // Update population to include tag details
    const notes = await Notes.find({ userId: session.user.id })
      .populate('folderId')
      .populate('tags') // This will populate the full tag objects
      .sort({ isPinned: -1, updatedAt: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await DBConnect();
    const data = await request.json();
    
    // Ensure all fields have default values
    const noteData = {
      title: data.title || 'Untitled',
      content: data.content ?? '', // Use nullish coalescing to handle empty strings properly
      userId: session.user.id,
      folderId: data.folderId || null,
      tags: data.tags || [],
      isPinned: Boolean(data.isPinned) || false
    };

    // Create and populate the note in one step
    const note = await (await Notes.create(noteData)).populate(['folderId', 'tags']);
    
    return NextResponse.json(note);
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ 
      error: "Failed to create note", 
      details: error.message 
    }, { status: 500 });
  }
}
