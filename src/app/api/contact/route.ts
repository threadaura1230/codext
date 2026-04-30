import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import { isAuthenticated } from "@/lib/auth";

// Public POST: Send a message
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const message = await Message.create(body);
    return NextResponse.json({ success: true, message: "Inquiry received" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// Admin GET: List all messages
export async function GET() {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
