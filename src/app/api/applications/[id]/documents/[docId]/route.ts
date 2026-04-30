import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

// DELETE /api/applications/[id]/documents/[docId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const { id, docId } = await params; // ✅ unwrap both

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
}
