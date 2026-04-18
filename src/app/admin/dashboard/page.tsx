"use client";

import { ApplicationStatus, fakeApplications } from "@/lib/fakeData";
import Link from "next/link";
import { useState } from "react";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  under_review: "bg-blue-50 text-blue-700 border border-blue-200",
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

const ALL_STATUSES = [
  "all",
  "pending",
  "under_review",
  "approved",
  "rejected",
] as const;

export default function AdminDashboardPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = fakeApplications.filter((app) => {
    const matchesStatus = filter === "all" || app.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      app.fullName.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.nationality.toLowerCase().includes(q) ||
      app.visaType.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: fakeApplications.length,
    pending: fakeApplications.filter((a) => a.status === "pending").length,
    under_review: fakeApplications.filter((a) => a.status === "under_review")
      .length,
    approved: fakeApplications.filter((a) => a.status === "approved").length,
    rejected: fakeApplications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all visa applications
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: counts.all, color: "text-gray-900" },
          { label: "Pending", value: counts.pending, color: "text-amber-600" },
          {
            label: "Under Review",
            value: counts.under_review,
            color: "text-blue-600",
          },
          {
            label: "Approved",
            value: counts.approved,
            color: "text-green-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 px-5 py-4"
          >
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className={`text-3xl font-semibold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex gap-1.5">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                filter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s as ApplicationStatus]}{" "}
              <span className="opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="14"
            height="14"
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
          <input
            type="text"
            placeholder="Search name, ID, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                ID
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Applicant
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Visa Type
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Nationality
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Submitted
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-gray-400 text-sm"
                >
                  No applications found.
                </td>
              </tr>
            )}
            {filtered.map((app, i) => (
              <tr
                key={app.id}
                className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}
              >
                <td className="px-5 py-4 font-mono text-xs text-gray-500">
                  {app.id}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{app.fullName}</p>
                  <p className="text-xs text-gray-400">{app.email}</p>
                </td>
                <td className="px-5 py-4 text-gray-700">{app.visaType}</td>
                <td className="px-5 py-4 text-gray-600">{app.nationality}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">
                  {new Date(app.submittedAt).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.status]}`}
                  >
                    {STATUS_LABELS[app.status]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/dashboard/${app.id}`}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
