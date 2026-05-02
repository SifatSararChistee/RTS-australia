import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/auth-utils";

const VALID_STATUSES = ["pending", "approved", "rejected"];

// PATCH /api/applications/[id]/status
// Body: { status: "approved" | "rejected" | "pending" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await verifyAdminSession(req);
    const { id } = await params;

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
      .eq("id", id)
      .select("id, status")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to update status." },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
