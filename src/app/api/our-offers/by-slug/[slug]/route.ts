import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Offer from "@/models/Offer";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    const offer = await Offer.findOne({ slug, isActive: true });
    
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    
    return NextResponse.json(offer);
  } catch (error) {
    console.error("Error fetching offer by slug:", error);
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 });
  }
}
