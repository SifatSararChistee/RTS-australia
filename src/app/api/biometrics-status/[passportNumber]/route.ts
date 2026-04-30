import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

// Static fingerprint image shown for all completed users
const STATIC_FINGERPRINT_IMAGE =
  "https://pngimg.com/uploads/fingerprint/fingerprint_PNG51.png"; // 🔁 Replace with your actual image URL

const FINGERPRINTS = [
  { side: "Left", finger: "Thumb" },
  { side: "Left", finger: "Index" },
  { side: "Left", finger: "Middle" },
  { side: "Left", finger: "Ring" },
  { side: "Left", finger: "Little" },
  { side: "Right", finger: "Thumb" },
  { side: "Right", finger: "Index" },
  { side: "Right", finger: "Middle" },
  { side: "Right", finger: "Ring" },
  { side: "Right", finger: "Little" },
].map((fp) => ({ ...fp, imageUrl: STATIC_FINGERPRINT_IMAGE }));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ passportNumber: string }> },
) {
  try {
    const { passportNumber } = await params;
    const decoded = decodeURIComponent(passportNumber).toUpperCase();

    const { data, error } = await supabase
      .from("applications")
      .select(
        "passport_number, full_name, status, biometrics_status, updated_at",
      )
      .ilike("passport_number", decoded)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error: "No biometrics record found for the provided passport number.",
        },
        { status: 404 },
      );
    }

    const isVerified = data.biometrics_status === "completed";

    return NextResponse.json({
      record: {
        passportNumber: data.passport_number,
        fullName: data.full_name,
        status: data.biometrics_status,
        biometrics: {
          verified: isVerified,
          capturedAt: isVerified ? data.updated_at : null,
          fingerprints: isVerified ? FINGERPRINTS : [],
        },
      },
    });
  } catch (error) {
    console.error("Biometrics API Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
