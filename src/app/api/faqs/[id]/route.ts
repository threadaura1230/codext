import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Faq from "@/models/Faq";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const faq = await Faq.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });

    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });

    return NextResponse.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
