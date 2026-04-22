import { fakeApplications } from "@/lib/fakeData";
import Link from "next/link";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  under_review: "bg-blue-50 text-blue-700 border border-blue-200",
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_LABELS = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

export const metadata = {
  title: "All Applicants — RTS Australia",
  description: "View all visa applicants",
};

export default function AllApplicantsPage() {
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
        <p className="text-sm text-gray-400 mb-5">
          {fakeApplications.length} applicant
          {fakeApplications.length !== 1 ? "s" : ""} total
        </p>

        <div className="space-y-3">
          {fakeApplications.map((app, i) => (
            <Link
              key={app.id}
              href={`/applicants/${app.id}`}
              className="group flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-blue-600">
                  {app.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {app.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
