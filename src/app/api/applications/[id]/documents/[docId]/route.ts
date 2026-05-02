import { verifyAdminSession } from "@/lib/auth-utils";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/applications/[id]/documents/[docId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    await verifyAdminSession(req);
    const { id, docId } = await params;

    // Verify the doc belongs to this application before deleting
    const { data: existing, error: fetchError } = await supabase
      .from("documents")
      .select("id")
      .eq("id", docId)
      .eq("application_id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Document not found for this application." },
        { status: 404 },
      );
    }

    const { error } = await supabase.from("documents").delete().eq("id", docId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete document." },
        { status: 500 },
      );
    }

    return NextResponse.json({ deleted: true, id: docId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
