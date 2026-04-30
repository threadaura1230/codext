import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Work from "@/models/Work";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const work = await Work.findOne({ slug, isActive: true });
    
    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }
    
    return NextResponse.json(work);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch work details" }, { status: 500 });
  }
}
