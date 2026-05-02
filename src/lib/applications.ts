import { supabase } from "./supabase";

export interface ApplicationSummary {
  id: string;
  full_name: string;
  visa_type: string;
}

export async function getAllApplicationsSummary(): Promise<
  ApplicationSummary[]
> {
  const { data, error } = await supabase
    .from("applications")
    .select(`id, full_name, visa_type`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  return (data as ApplicationSummary[]) ?? [];
}

export async function getApplicationSummaryById(
  id: string,
): Promise<ApplicationSummary | null> {
  const { data, error } = await supabase
    .from("applications")
    .select(`id, full_name, visa_type`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return null;
  }

  return data as ApplicationSummary;
}
