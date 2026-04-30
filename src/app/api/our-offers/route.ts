import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Offer from "@/models/Offer";
import { isAuthenticated } from "@/lib/auth";

// Public GET: Fetch all active offers
export async function GET() {
  try {
    await dbConnect();
    const offers = await Offer.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

// Admin POST: Create a new offer
export async function POST(req: Request) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // Auto-generate slug if missing
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check if slug already exists
    if (body.slug) {
      const existing = await Offer.findOne({ slug: body.slug });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists. Please choose a different title or slug." }, { status: 400 });
      }
    }

    const offer = await Offer.create(body);
    return NextResponse.json(offer, { status: 201 });
  } catch (error: any) {
    console.error("Error creating offer:", error);
    return NextResponse.json({ error: error.message || "Failed to create offer" }, { status: 500 });
  }
}
