import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

// GET /api/all-applications
// Optional query params:
//   ?status=pending|approved|rejected
//   ?visa_type=Tourist Visa
//   ?search=passport_number or full_name
//   ?sort=created_at|full_name   (default: created_at desc)
export async function GET(req: NextRequest) {
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
}
