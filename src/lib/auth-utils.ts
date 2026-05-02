import { NextRequest } from "next/server";
import { supabase } from "./supabase";

/**
 * Verifies the admin session using the sb-access-token cookie.
 * @throws Error if session is invalid or token is missing.
 * @returns The authenticated user object.
 */
export async function verifyAdminSession(req: NextRequest): Promise<{ data: any }> {
  const accessToken = req.cookies.get("sb-access-token")?.value;

  if (!accessToken) {
    throw new Error("Unauthorized: No access token provided");
  }

  // Validate the token explicitly using getUser
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    throw new Error("Unauthorized: Invalid session");
  }

  return { data: user };
}
