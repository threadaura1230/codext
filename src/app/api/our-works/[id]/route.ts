import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Work from "@/models/Work";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // Auto-generate slug if title changed and slug is cleared
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check for slug conflict
    if (body.slug) {
      const existing = await Work.findOne({ slug: body.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists. Please choose a different title." }, { status: 400 });
      }
    }

    const work = await Work.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!work) return NextResponse.json({ error: "Work not found" }, { status: 404 });

    return NextResponse.json(work);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update work" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const work = await Work.findByIdAndDelete(id);
    if (!work) return NextResponse.json({ error: "Work not found" }, { status: 404 });

    return NextResponse.json({ message: "Work deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete work" }, { status: 500 });
  }
}
