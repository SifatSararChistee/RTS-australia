// app/api/visa-status/route.ts

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const passportNumber =
      searchParams.get("passportNumber")?.trim().toUpperCase() || "";

    const fullName = searchParams.get("fullName")?.trim().toLowerCase() || "";

    const visaGrantNumber =
      searchParams.get("visaGrantNumber")?.trim().toUpperCase() || "";

    // only 3 required fields
    if (!passportNumber || !fullName || !visaGrantNumber) {
      return NextResponse.json(
        {
          error:
            "Full name, passport number and visa grant number are required.",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("passport_number", passportNumber)
      .eq("visa_grant_number", visaGrantNumber)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error:
            "No matching record found. Please ensure all details are correct.",
        },
        { status: 404 },
      );
    }

    // verify full name only
    if (data.full_name?.toLowerCase() !== fullName) {
      return NextResponse.json(
        {
          error:
            "No matching record found. Please ensure all details are correct.",
        },
        { status: 404 },
      );
    }

    const hasEvisa = !!data.evisa_link;

    return NextResponse.json({
      application: {
        passportNumber: data.passport_number,
        fullName: data.full_name,
        status: hasEvisa ? "Approved" : "Processing",
        evisaLink: data.evisa_link || null,

        documents: hasEvisa
          ? [
              {
                id: String(data.id),
                fileName: "E-Visa.pdf",
                fileUrl: data.evisa_link,
                uploadedAt: data.updated_at,
              },
            ]
          : [],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 },
    );
  }
}
