import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("applications")
    .select(`*, documents(*)`)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Application not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Delete documents first if no CASCADE is set
  await supabase.from("documents").delete().eq("application_id", id);

  const { error } = await supabase.from("applications").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
