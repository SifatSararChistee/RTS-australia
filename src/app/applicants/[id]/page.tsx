import Link from "next/link";
import { notFound } from "next/navigation";

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

async function getAllApplications(): Promise<Application[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/all-applications`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
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

export async function generateStaticParams() {
  const apps = await getAllApplications();
  return apps.map((app) => ({ id: app.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apps = await getAllApplications();
  const app = apps.find((a) => a.id === id);
  return {
    title: app ? `${app.full_name} — RTS Australia` : "Applicant Not Found",
  };
}

export default async function ApplicantProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apps = await getAllApplications();
  const app = apps.find((a) => a.id === id);

  if (!app) notFound();

  const initials = getInitials(app.full_name);

  const STATUS_STYLES: Record<Application["status"], string> = {
    approved: "bg-green-50 text-green-700 border border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/applicants"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All Applicants
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {app.full_name}
                </h1>
                <p className="text-sm text-gray-400 mt-1">{app.visa_type}</p>
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full capitalize border ${STATUS_STYLES[app.status]}`}
                >
                  {app.status}
                </span>
              </div>
            </div>

            <Link
              href="/check-visa"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Check Visa Status
            </Link>
          </div>
        </div>

        {/* Track CTA banner */}
        <div className="bg-blue-600 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white font-semibold">
              Want to track this application?
            </p>
            <p className="text-blue-200 text-sm mt-0.5">
              Check the live visa status for {app.full_name.split(" ")[0]}.
            </p>
          </div>
          <Link
            href="/check-visa"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shrink-0"
          >
            Check Visa Status &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
