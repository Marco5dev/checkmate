import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import NotesFolder from "@/models/NotesFolder";
import Notes from "@/models/Notes";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await DBConnect();
    const folder = await NotesFolder.findOne({
      _id: params.id,
      userId: session.user.id
    });

    if (!folder) return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    await DBConnect();
    
    const folder = await NotesFolder.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      data,
      { new: true }
    );

    if (!folder) return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deleteNotes = searchParams.get('deleteNotes') === 'true';
    const folderId = params.id;

    await DBConnect();

    // First delete the folder
    const folder = await NotesFolder.findOneAndDelete({
      _id: folderId,
      userId: session.user.id
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Handle the notes based on deleteNotes parameter
    if (deleteNotes) {
      // Delete all notes in the folder
      await Notes.deleteMany({ folderId: folderId });
    } else {
      // Update notes to remove folder reference
      await Notes.updateMany(
        { folderId: folderId },
        { $set: { folderId: null } }
      );
    }

    return NextResponse.json({ 
      message: "Folder deleted successfully",
      notesDeleted: deleteNotes
    });
  } catch (error) {
    console.error("Delete folder error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
