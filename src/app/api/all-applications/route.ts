import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAdminSession } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminSession(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const visaType = searchParams.get("visa_type");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") ?? "created_at";

    let query = supabase.from("applications").select(`
        id,
        full_name,
        father_name,
        mother_name,
        email,
        phone,
        nid,
        passport_number,
        passport_validity,
        visa_type,
        current_address,
        permanent_address,
        status,
        evisa_link,
        visa_grant_number,
        biometrics_status,
        created_at,
        updated_at,
        documents ( id, title, link, uploaded_at )
      `);

    // Filters
    if (status) query = query.eq("status", status);
    if (visaType) query = query.eq("visa_type", visaType);
    if (search)
      query = query.or(
        `full_name.ilike.%${search}%,passport_number.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      );

    // Sorting
    const validSorts = ["created_at", "full_name", "updated_at"];
    const sortColumn = validSorts.includes(sort) ? sort : "created_at";
    query = query.order(sortColumn, { ascending: sortColumn === "full_name" });

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications." },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
