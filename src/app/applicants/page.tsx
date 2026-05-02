"use client";

import { getAllApplications, type Application } from "@/lib/applications";
import Link from "next/link";
import { useEffect, useState } from "react";

function getInitials(name: string): string {
  if (!name?.trim()) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AllApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllApplications().then((data) => {
      setApplications(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
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

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="space-y-3">
            {[160, 130, 190, 145, 170].map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
                  <div>
                    <div
                      className="h-3.5 bg-gray-100 rounded animate-pulse mb-2"
                      style={{ width: w }}
                    />
                    <div className="h-2.5 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-5">
              {applications.length} applicant
              {applications.length !== 1 ? "s" : ""} total
            </p>

            {applications.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-gray-400 text-sm">
                No applicants found.
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applicants/${app.id}`}
                    className="group flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-sm font-semibold text-blue-600">
                        {getInitials(app.full_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {app.full_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {app.visa_type}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">
                      &rarr;
                    </span>
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
