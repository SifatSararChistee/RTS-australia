import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

const VALID_STATUSES = ["pending", "approved", "rejected"];

// PATCH /api/applications/[id]/status
// Body: { status: "approved" | "rejected" | "pending" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // ✅ unwrap here

  const body = await req.json();
  const { status } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id) // ✅ use id এখানে
    .select("id, status")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Failed to update status." },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
