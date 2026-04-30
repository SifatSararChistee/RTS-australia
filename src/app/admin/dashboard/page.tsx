"use client";

import { Application, ApplicationStatus } from "@/lib/mockData";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  approved: {
    label: "Approved",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
};

const VISA_TYPES = [
  "All",
  "Tourist Visa",
  "Student Visa",
  "Business Visa",
  "Job Visa",
  "Residence Visa",
  "Diplomatic Visa",
];

const IconSearch = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconFilter = () => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const IconChevron = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconPassport = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="2" width="18" height="20" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20h10" />
  </svg>
);
const IconDoc = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const IconFingerprint = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
    <path d="M5 19.5C5.5 18 6 15 6 12c0-1.7.7-3.3 1.8-4.5" />
    <path d="M17.5 5c.7 1.1 1.2 2.4 1.4 3.8" />
    <path d="M22 12c0 4.4-2.6 8.2-6.4 10" />
    <path d="M11 12c0 .8-.3 1.6-.8 2.2" />
    <path d="M12 8c1.1 0 2.1.5 2.8 1.2" />
    <path d="M15 12c0 2.5-.9 4.8-2.3 6.5" />
  </svg>
);
const IconRefresh = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

function StatCard({
  label,
  value,
  sub,
  accent,
  delay,
}: {
  label: string;
  value: number;
  sub: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 relative overflow-hidden"
    >
      <div
        className={`absolute top-0 left-0 w-1 h-full ${accent} rounded-l-2xl`}
      />
      <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </motion.div>
  );
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr_0.6fr_0.4fr] gap-4 px-6 py-4 border-b border-slate-50 items-center animate-pulse">
      <div className="space-y-1.5">
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-2 bg-slate-100 rounded w-1/2" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-2 bg-slate-100 rounded w-2/3" />
      </div>
      <div className="h-3 bg-slate-100 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
      <div className="h-5 bg-slate-100 rounded-full w-16" />
      <div className="h-3 bg-slate-100 rounded w-10" />
      <div />
    </div>
  );
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [visaFilter, setVisaFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"created_at" | "full_name">(
    "created_at",
  );

  async function fetchApplications() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/all-applications");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: Application[] = await res.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    }),
    [applications],
  );

  const filtered = useMemo(() => {
    return applications
      .filter((a) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          a.full_name.toLowerCase().includes(q) ||
          a.passport_number.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.includes(q);
        const matchStatus = statusFilter === "all" || a.status === statusFilter;
        const matchVisa = visaFilter === "All" || a.visa_type === visaFilter;
        return matchSearch && matchStatus && matchVisa;
      })
      .sort((a, b) => {
        if (sortBy === "full_name")
          return a.full_name.localeCompare(b.full_name);
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
  }, [applications, search, statusFilter, visaFilter, sortBy]);

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
              RTS Australia
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-slate-400 font-mono">
              {new Date().toLocaleDateString("en-AU", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <button
              onClick={fetchApplications}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-500 hover:bg-white hover:border-slate-300 transition-all disabled:opacity-40"
            >
              <span className={loading ? "animate-spin" : ""}>
                <IconRefresh />
              </span>
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchApplications}
              className="text-xs text-red-500 font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total"
            value={stats.total}
            sub="applications"
            accent="bg-slate-300"
            delay={0.05}
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            sub="awaiting decision"
            accent="bg-amber-400"
            delay={0.1}
          />
          <StatCard
            label="Approved"
            value={stats.approved}
            sub="visas granted"
            accent="bg-emerald-400"
            delay={0.15}
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            sub="applications denied"
            accent="bg-red-400"
            delay={0.2}
          />
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 mb-5 flex flex-wrap gap-3 items-center"
        >
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search name, passport, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <IconFilter />
            {(["all", "pending", "approved", "rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${statusFilter === s ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          <select
            value={visaFilter}
            onChange={(e) => setVisaFilter(e.target.value)}
            className="text-xs text-slate-600 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
          >
            {VISA_TYPES.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs text-slate-600 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
          >
            <option value="created_at">Newest first</option>
            <option value="full_name">Name A–Z</option>
          </select>
        </motion.div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-xs text-slate-400 mb-3 px-1">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {applications.length !== filtered.length &&
              ` of ${applications.length} total`}
          </p>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr_0.6fr_0.4fr] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/70">
            {[
              "Applicant",
              "Contact",
              "Passport",
              "Visa Type",
              "Status",
              "Biometrics",
              "",
            ].map((h) => (
              <p
                key={h}
                className="text-[10px] font-semibold tracking-widest uppercase text-slate-400"
              >
                {h}
              </p>
            ))}
          </div>

          {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-2xl mb-2">🗂️</p>
              <p className="text-sm text-slate-400">
                {applications.length === 0
                  ? "No applications yet."
                  : "No applications match your filters."}
              </p>
            </div>
          )}

          {!loading &&
            filtered.map((app, i) => (
              <ApplicationRow key={app.id} app={app} index={i} />
            ))}
        </motion.div>
      </div>
    </div>
  );
}

function ApplicationRow({ app, index }: { app: Application; index: number }) {
  const cfg = STATUS_CONFIG[app.status];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.32 + index * 0.04,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_0.8fr_0.6fr_0.4fr] gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors items-center group"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {app.full_name}
        </p>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
          {new Date(app.created_at).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-600 truncate">{app.email}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{app.phone}</p>
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-slate-300 shrink-0">
          <IconPassport />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-mono text-slate-700 truncate">
            {app.passport_number}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            exp{" "}
            {new Date(app.passport_validity).toLocaleDateString("en-AU", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-600 truncate">{app.visa_type}</p>
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold w-fit ${cfg.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
        {cfg.label}
      </span>
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-medium ${app.biometrics_status === "completed" ? "text-emerald-600" : "text-slate-400"}`}
      >
        <IconFingerprint />
        {app.biometrics_status === "completed" ? "Done" : "Pending"}
      </span>
      <div className="flex items-center gap-2 justify-end">
        {(app.documents?.length ?? 0) > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
            <IconDoc />
            {app.documents.length}
          </span>
        )}
        <Link
          href={`/admin/dashboard/${app.id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700"
        >
          <IconChevron />
        </Link>
      </div>
    </motion.div>
  );
}
