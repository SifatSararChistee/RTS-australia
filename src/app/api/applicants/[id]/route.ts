import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/applicants/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("applications")
    .select("id, full_name, visa_type")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Applicant not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}
