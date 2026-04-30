import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // service role key — never expose to client
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
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
    } = body;

    // Basic presence validation
    if (
      !full_name ||
      !father_name ||
      !mother_name ||
      !email ||
      !phone ||
      !nid ||
      !passport_number ||
      !passport_validity ||
      !visa_type ||
      !current_address ||
      !permanent_address
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          full_name,
          father_name,
          mother_name,
          email,
          phone,
          nid,
          passport_number: passport_number.toUpperCase(),
          passport_validity,
          visa_type,
          current_address,
          permanent_address,
          // Admin-controlled fields — set to defaults on creation
          status: "pending",
          biometrics_status: "pending",
          evisa_link: null,
          visa_grant_number: null,
        },
      ])
      .select("id, passport_number")
      .single();

    if (error) {
      // Supabase unique constraint violation (duplicate passport_number)
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "An application with this passport number already exists.",
          },
          { status: 409 },
        );
      }

      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit application. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Application submitted successfully.", data },
      { status: 201 },
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
