import { verifyAdminSession } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/applications/[id]/visa-grant-number
// Body: { visa_grant_number: "VGN-2024-000123" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await verifyAdminSession(req);
    const { id } = await params;

    const body = await req.json();
    const { visa_grant_number } = body;

    if (!visa_grant_number || typeof visa_grant_number !== "string") {
      return NextResponse.json(
        { error: "visa_grant_number is required." },
        { status: 400 },
      );
    }

    const normalized = visa_grant_number.trim().toUpperCase();

    const { data, error } = await supabase
      .from("applications")
      .update({ visa_grant_number: normalized })
      .eq("id", id)
      .select("id, visa_grant_number")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to update Visa Grant Number." },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
