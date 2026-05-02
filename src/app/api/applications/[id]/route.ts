import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/auth-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await verifyAdminSession(req);
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await verifyAdminSession(req);
    const { id } = await params;

    // Delete documents first if no CASCADE is set
    await supabase.from("documents").delete().eq("application_id", id);

    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
