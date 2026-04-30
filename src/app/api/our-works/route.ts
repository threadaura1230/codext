import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Work from "@/models/Work";
import { isAuthenticated } from "@/lib/auth";

// Public GET: List all active works
export async function GET() {
  try {
    await dbConnect();
    const works = await Work.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(works);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 });
  }
}

// Admin POST: Create a new work
export async function POST(req: Request) {
  try {
    if (!await isAuthenticated()) {
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

    // Check for existing slug
    if (body.slug) {
      const existing = await Work.findOne({ slug: body.slug });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists. Please choose a different title." }, { status: 400 });
      }
    }

    const work = await Work.create(body);
    return NextResponse.json(work, { status: 201 });
  } catch (error) {
    console.error("Error creating work:", error);
    return NextResponse.json({ error: "Failed to create work" }, { status: 500 });
  }
}
