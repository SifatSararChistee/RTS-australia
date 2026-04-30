import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

// GET /api/applications/[id]/documents
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // ✅ unwrap

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("application_id", id) // ✅ use id
    .order("uploaded_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch documents." },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

// POST /api/applications/[id]/documents
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // ✅ unwrap

  const body = await req.json();
  const { title, link } = body;

  if (!link || typeof link !== "string") {
    return NextResponse.json({ error: "link is required." }, { status: 400 });
  }

  if (!link.includes("drive.google.com") && !link.includes("docs.google.com")) {
    return NextResponse.json(
      { error: "link must be a Google Drive link." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        application_id: id, // ✅ use id
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
}
