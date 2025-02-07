import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const wallpapersDir = path.join(process.cwd(), 'public/wallpapers');
    const files = fs.readdirSync(wallpapersDir);
    
    const wallpapers = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => ({
        name: path.parse(file).name,
        value: path.parse(file).name,
        path: `/wallpapers/${file}`
      }));

    return NextResponse.json(wallpapers);
  } catch (error) {
    console.error('Error reading wallpapers:', error);
    return NextResponse.json({ error: 'Failed to fetch wallpapers' }, { status: 500 });
  }
}
