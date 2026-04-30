import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Faq from "@/models/Faq";
import { isAuthenticated } from "@/lib/auth";

// Public GET: List all active FAQs
export async function GET() {
  try {
    await dbConnect();
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

// Admin POST: Create a new FAQ
export async function POST(req: Request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const faq = await Faq.create(body);
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
