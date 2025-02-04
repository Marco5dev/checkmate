import { NextResponse } from "next/server";
import Folder from "@/models/Folder";
import Task from "@/models/Task"; // Add this import
import { DBConnect } from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await DBConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching folders for user:", session.user.id); // Debug log

    const folders = await Folder.find({ userId: session.user.id }).lean();
    console.log("Found folders:", folders); // Debug log

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error); // Debug log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await DBConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized or missing user ID" },
        { status: 401 }
      );
    }

    const { name, parentId } = await request.json();
    
    const folderData = {
      name,
      userId: session.user.id,
      parentId: parentId || null
    };

    console.log('Creating folder with:', folderData);

    const folder = await Folder.create(folderData);
    return NextResponse.json(folder);
  } catch (error) {
    console.error('Folder creation error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to create folder" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await DBConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId, name, parentId } = await request.json();
    const folder = await Folder.findOneAndUpdate(
      { _id: folderId, userId: session.user.id },
      { name, parentId },
      { new: true }
    );

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await DBConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId, deleteTasks } = await request.json();
    
    // Delete all nested folders
    await Folder.deleteMany({ 
      userId: session.user.id,
      $or: [
        { _id: folderId },
        { parentId: folderId }
      ]
    });

    // Handle tasks based on user choice
    if (deleteTasks) {
      await Task.deleteMany({ folderId: folderId });
    } else {
      await Task.updateMany(
        { folderId: folderId },
        { $set: { folderId: null } }
      );
    }

    return NextResponse.json({ message: "Folder deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
