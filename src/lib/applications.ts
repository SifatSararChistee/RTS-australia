import { createClient } from "@supabase/supabase-js";

export interface Document {
  id: string;
  link: string;
  title: string;
  uploaded_at: string;
}

export interface Application {
  id: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  email: string;
  phone: string;
  nid: string;
  passport_number: string;
  passport_validity: string;
  visa_type: string;
  current_address: string;
  permanent_address: string;
  status: "approved" | "pending" | "rejected";
  evisa_link: string | null;
  visa_grant_number: string | null;
  biometrics_status: "completed" | "pending" | "not_required";
  created_at: string;
  updated_at: string;
  documents: Document[];
}

// ✅ Use the service role key — safe on server only, never exposed to client
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export async function getAllApplications(): Promise<Application[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id, full_name, father_name, mother_name,
      email, phone, nid, passport_number, passport_validity,
      visa_type, current_address, permanent_address,
      status, evisa_link, visa_grant_number, biometrics_status,
      created_at, updated_at,
      documents ( id, title, link, uploaded_at )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  return (data as Application[]) ?? [];
}

export async function getApplicationById(
  id: string,
): Promise<Application | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id, full_name, father_name, mother_name,
      email, phone, nid, passport_number, passport_validity,
      visa_type, current_address, permanent_address,
      status, evisa_link, visa_grant_number, biometrics_status,
      created_at, updated_at,
      documents ( id, title, link, uploaded_at )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return null;
  }

  return data as Application;
}
