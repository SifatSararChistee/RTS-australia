import { verifyAdminSession } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/applications/[id]/evisa
// Body: { evisa_link: "https://drive.google.com/..." }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await verifyAdminSession(req);
    const { id } = await params;
    const body = await req.json();
    const { evisa_link } = body;

    if (!evisa_link || typeof evisa_link !== "string") {
      return NextResponse.json(
        { error: "evisa_link is required." },
        { status: 400 },
      );
    }

    if (!evisa_link.includes("drive.google.com")) {
      return NextResponse.json(
        { error: "evisa_link must be a Google Drive link." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("applications")
      .update({ evisa_link })
      .eq("id", id)
      .select("id, evisa_link")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to update E-Visa link." },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
