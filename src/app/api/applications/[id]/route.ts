import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// ✅ make sure this exists
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

// GET /api/applications/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // ✅ unwrap params

  const { data, error } = await supabase
    .from("applications")
    .select(`*, documents(*)`)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Application not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}
