import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

const VALID = ["pending", "completed"];

// PATCH /api/applications/[id]/biometrics
// Body: { biometrics_status: "pending" | "completed" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // ✅ unwrap params

  const body = await req.json();
  const { biometrics_status } = body;

  if (!biometrics_status || !VALID.includes(biometrics_status)) {
    return NextResponse.json(
      {
        error: `Invalid biometrics_status. Must be one of: ${VALID.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("applications")
    .update({ biometrics_status })
    .eq("id", id) // ✅ এখানে id use করো
    .select("id, biometrics_status")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Failed to update biometrics status." },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
