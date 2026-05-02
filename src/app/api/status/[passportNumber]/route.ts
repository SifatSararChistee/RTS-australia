import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ passportNumber: string }> },
) {
  const { passportNumber } = await params;

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      documents (
        id,
        title,
        link,
        uploaded_at
      )
    `,
    )
    .ilike("passport_number", passportNumber.trim())
    .single();

  if (error || !data) {
    return Response.json({ error: "No record found." }, { status: 404 });
  }

  return Response.json(data);
}
