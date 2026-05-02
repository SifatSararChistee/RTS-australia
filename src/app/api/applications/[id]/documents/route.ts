import { verifyAdminSession } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/applications/[id]/documents
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await verifyAdminSession(req);
    const { id } = await params;

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("application_id", id)
      .order("uploaded_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch documents." },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

// POST /api/applications/[id]/documents
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await verifyAdminSession(req);
    const { id } = await params;

    const body = await req.json();
    const { title, link } = body;

    if (!link || typeof link !== "string") {
      return NextResponse.json({ error: "link is required." }, { status: 400 });
    }

    if (
      !link.includes("drive.google.com") &&
      !link.includes("docs.google.com")
    ) {
      return NextResponse.json(
        { error: "link must be a Google Drive link." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          application_id: id,
          title: title?.trim() || "Untitled Document",
          link: link.trim(),
        },
      ])
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to add document." },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
