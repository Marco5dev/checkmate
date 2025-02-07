import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DBConnect } from "@/utils/mongodb";
import UserSettings from "@/models/UserSettings";

const DEFAULT_SETTINGS = {
  theme: "custom",
  wallpaper: "/wallpapers/Wall.png",
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Return default settings for unauthenticated users
    if (!session) {
      return NextResponse.json(DEFAULT_SETTINGS, { status: 401 });
    }

    await DBConnect();
    let settings = await UserSettings.findOne({ userId: session.user.id });

    // If no settings exist, create default settings
    if (!settings) {
      settings = await UserSettings.create({
        userId: session.user.id,
        ...DEFAULT_SETTINGS,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error in GET /api/user-settings:", error);
    // Even on error, return default settings
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await DBConnect();
    const data = await request.json();

    const settings = await UserSettings.findOneAndUpdate(
      { userId: session.user.id },
      { ...data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
