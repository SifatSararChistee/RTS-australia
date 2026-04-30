import Link from "next/link";

export const metadata = {
  title: "All Applicants — RTS Australia",
  description: "View all visa applicants",
};

// ✅ Full types derived from real API response
interface Document {
  id: string;
  link: string;
  title: string;
  uploaded_at: string;
}

interface Application {
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

async function getApplications(): Promise<{
  data: Application[] | null;
  error: boolean;
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/all-applications`, {
      cache: "no-store",
    });

    if (!res.ok) return { data: null, error: true };

    const data: Application[] = await res.json();
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
}

function getInitials(name: string): string {
  if (!name?.trim()) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const STATUS_STYLES: Record<Application["status"], string> = {
  approved: "bg-green-50 text-green-700 border border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

const AVATAR_COLORS: Record<Application["status"], string> = {
  approved: "bg-green-50 border-green-100 text-green-700",
  pending: "bg-yellow-50 border-yellow-100 text-yellow-700",
  rejected: "bg-red-50 border-red-100 text-red-700",
};

export default async function AllApplicantsPage() {
  const { data: applications, error } = await getApplications();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">
            Visa Applications
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            All Applicants
          </h1>
          <p className="text-gray-500 text-base max-w-xl">
            Browse all individuals who have submitted a visa application. Click
            any name to view their application profile.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600 mb-6">
            Failed to load applicants. Please try again later.
          </div>
        )}

        {!error && (
          <>
            <p className="text-sm text-gray-400 mb-5">
              {applications!.length} applicant
              {applications!.length !== 1 ? "s" : ""} total
            </p>

            {/* Empty state */}
            {applications!.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-gray-400 text-sm">
                No applicants found.
              </div>
            ) : (
              <div className="space-y-3">
                {applications!.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applicants/${app.id}`}
                    className="group flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar — color reflects status */}
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 text-sm font-semibold ${AVATAR_COLORS[app.status]}`}
                      >
                        {getInitials(app.full_name)}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {app.full_name}
                        </p>
                        {/* Extra info from real data */}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {app.visa_type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status badge */}
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[app.status]}`}
                      >
                        {app.status}
                      </span>

                      {/* Docs count */}
                      <span className="text-xs text-gray-400">
                        {app.documents.length} doc
                        {app.documents.length !== 1 ? "s" : ""}
                      </span>

                      <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
