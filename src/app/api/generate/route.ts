import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { prompt } = await req.json();
  await inngest.send({ name: "api/video.requested", data: { prompt, videoId: "123" } });
  return NextResponse.json({ message: "Success" });
}

