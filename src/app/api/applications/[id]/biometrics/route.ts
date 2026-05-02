import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/auth-utils";

const VALID = ["pending", "completed"];

// PATCH /api/applications/[id]/biometrics
// Body: { biometrics_status: "pending" | "completed" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await verifyAdminSession(req);
    const { id } = await params;

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
      .eq("id", id)
      .select("id, biometrics_status")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to update biometrics status." },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
