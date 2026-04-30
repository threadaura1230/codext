import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { isAuthenticated } from "@/lib/auth";

// Public GET: List all active blogs
export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// Admin POST: Create a new blog
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
      const existing = await Blog.findOne({ slug: body.slug });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists. Please choose a different title." }, { status: 400 });
      }
    }

    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
