import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET /api/applicants
export async function GET() {
  const { data, error } = await supabase
    .from("applications")
    .select("id, full_name, visa_type")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants." },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? []);
}
