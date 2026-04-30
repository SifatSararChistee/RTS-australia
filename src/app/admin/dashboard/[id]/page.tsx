"use client";

import { ApplicationStatus, BiometricsStatus } from "@/lib/mockData";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DbDocument {
  id: string;
  title: string;
  link: string;
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
  status: ApplicationStatus;
  evisa_link: string | null;
  visa_grant_number: string | null;
  biometrics_status: BiometricsStatus;
  created_at: string;
  updated_at: string;
  documents: DbDocument[];
}

// ── Status config ─────────────────────────────────────────────────────────────

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

// ── Drive doc types ───────────────────────────────────────────────────────────

type DocType = "pdf" | "image";

interface DriveDoc {
  id: string;
  title: string;
  url: string;
  fileId: string;
  type: DocType;
}

function extractFileId(url: string): string | null {
  let m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = url.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  return null;
}

function getEmbedUrl(fileId: string, type: DocType) {
  return type === "pdf"
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

function dbDocToDriveDoc(d: DbDocument, type: DocType = "pdf"): DriveDoc {
  return {
    id: d.id,
    title: d.title,
    url: d.link,
    fileId: extractFileId(d.link) ?? d.id,
    type,
  };
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const I = {
  ArrowLeft: () => (
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
  ),
  Person: () => (
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Passport: () => (
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
  ),
  Location: () => (
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Fingerprint: () => (
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
  ),
  Docs: () => (
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
  ),
  Eye: () => (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ExternalLink: () => (
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  X: () => (
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Link: () => (
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Hash: () => (
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
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
};

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
        {label}
      </p>
      <p
        className={`text-sm text-slate-800 leading-relaxed ${mono ? "font-mono" : ""}`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <span className="text-slate-400">{icon}</span>
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
}

// ── Doc Card ──────────────────────────────────────────────────────────────────

function DocCard({
  doc,
  onView,
  onRemove,
}: {
  doc: DriveDoc;
  onView: (doc: DriveDoc) => void;
  onRemove: (id: string) => void;
}) {
  const thumbUrl = `https://drive.google.com/thumbnail?id=${doc.fileId}&sz=w400`;
  return (
    <div className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200">
      <div
        className="relative h-36 bg-slate-100 cursor-pointer overflow-hidden"
        onClick={() => onView(doc)}
      >
        <img
          src={thumbUrl}
          alt={doc.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            const ph = img.nextElementSibling as HTMLElement;
            if (ph) ph.style.display = "flex";
          }}
        />
        <div
          className="absolute inset-0 flex-col items-center justify-center gap-2 text-slate-400"
          style={{ display: "none" }}
        >
          <span className="text-3xl">{doc.type === "pdf" ? "📄" : "🖼️"}</span>
          <span className="text-xs text-center px-4">
            Preview unavailable — set file to "Anyone with link"
          </span>
        </div>
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${doc.type === "pdf" ? "bg-red-100 text-red-600 border border-red-200" : "bg-emerald-100 text-emerald-600 border border-emerald-200"}`}
        >
          {doc.type === "pdf" ? "PDF" : "IMG"}
        </span>
        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold flex items-center gap-1.5">
            <I.Eye /> View Full
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-slate-700 truncate mb-0.5">
          {doc.title}
        </p>
        <p className="text-[10px] text-slate-400 truncate mb-2.5 font-mono">
          {doc.url.substring(0, 45)}
          {doc.url.length > 45 ? "…" : ""}
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={() => onView(doc)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 transition-all"
          >
            <I.Eye /> View
          </button>
          <button
            onClick={() => window.open(doc.url, "_blank")}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 transition-all"
          >
            <I.ExternalLink /> Drive
          </button>
          <button
            onClick={() => onRemove(doc.id)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
          >
            <I.X />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-32 mb-8" />
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
        <div className="h-5 bg-slate-200 rounded w-48 mb-3" />
        <div className="h-3 bg-slate-100 rounded w-32 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-24" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-4"
        >
          <div className="h-3 bg-slate-200 rounded w-40 mb-4" />
          <div className="grid grid-cols-3 gap-5">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="space-y-1.5">
                <div className="h-2 bg-slate-100 rounded w-16" />
                <div className="h-3 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [status, setStatus] = useState<ApplicationStatus>("pending");
  const [biometrics, setBiometrics] = useState<BiometricsStatus>("pending");
  const [evisaLink, setEvisaLink] = useState<string | null>(null);
  const [evisaInput, setEvisaInput] = useState("");
  const [evisaLoading, setEvisaLoading] = useState(false);
  const [visaGrantNumber, setVisaGrantNumber] = useState<string | null>(null);
  const [visaGrantInput, setVisaGrantInput] = useState("");
  const [visaGrantLoading, setVisaGrantLoading] = useState(false);
  const [visaGrantEditing, setVisaGrantEditing] = useState(false);
  const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalDoc, setModalDoc] = useState<DriveDoc | null>(null);
  const [docs, setDocs] = useState<DriveDoc[]>([]);
  const [docLinkInput, setDocLinkInput] = useState("");
  const [docTitleInput, setDocTitleInput] = useState("");
  const [docType, setDocType] = useState<DocType>("pdf");
  const [docError, setDocError] = useState("");
  const [docLoading, setDocLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`/api/applications/${id}`);
        if (!res.ok)
          throw new Error(
            res.status === 404
              ? "Application not found."
              : `Server error: ${res.status}`,
          );
        const data: Application = await res.json();
        setApp(data);
        setStatus(data.status);
        setBiometrics(data.biometrics_status);
        setEvisaLink(data.evisa_link);
        setVisaGrantNumber(data.visa_grant_number);
        setDocs((data.documents ?? []).map((d) => dbDocToDriveDoc(d, "pdf")));
      } catch (err: any) {
        setFetchError(err.message || "Failed to load application.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ── Loading / error ───────────────────────────────────────────────────────

  if (loading)
    return (
      <div
        className="min-h-screen bg-slate-50"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <Skeleton />
      </div>
    );

  if (fetchError || !app)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-3">
            {fetchError ?? "Application not found."}
          </p>
          <Link
            href="/admin/dashboard"
            className="text-blue-600 text-sm hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );

  const cfg = STATUS_CONFIG[status];

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleAction(action: "approve" | "reject") {
    if (!app) {
      toast.error("Application not loaded yet");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/applications/${app.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "approve" ? "approved" : "rejected",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus(action === "approve" ? "approved" : "rejected");
      toast.success(
        action === "approve"
          ? "Application approved."
          : "Application rejected.",
      );
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  }

  async function handleBiometricsToggle() {
    if (!app) {
      toast.error("Application not loaded yet");
      return;
    }

    const next: BiometricsStatus =
      biometrics === "pending" ? "completed" : "pending";
    try {
      const res = await fetch(`/api/applications/${app.id}/biometrics`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biometrics_status: next }),
      });
      if (!res.ok) throw new Error();
      setBiometrics(next);
      toast.success(`Biometrics marked as ${next}.`);
    } catch {
      toast.error("Failed to update biometrics.");
    }
  }

  async function handleSaveEvisa() {
    if (!app) {
      toast.error("Application not loaded yet");
      return;
    }

    const link = evisaInput.trim();
    if (!link) return toast.error("Please enter a Google Drive link.");
    if (!link.includes("drive.google.com"))
      return toast.error("Must be a Google Drive link.");
    setEvisaLoading(true);
    try {
      const res = await fetch(`/api/applications/${app.id}/evisa`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evisa_link: link }),
      });
      if (!res.ok) throw new Error();
      setEvisaLink(link);
      setEvisaInput("");
      toast.success("E-Visa link saved!");
    } catch {
      toast.error("Failed to save E-Visa link.");
    } finally {
      setEvisaLoading(false);
    }
  }

  async function handleSaveVisaGrantNumber() {
    if (!app) {
      toast.error("Application not loaded yet");
      return;
    }

    const value = visaGrantInput.trim().toUpperCase();
    if (!value) return toast.error("Please enter a Visa Grant Number.");
    setVisaGrantLoading(true);
    try {
      const res = await fetch(`/api/applications/${app.id}/visa-grant-number`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visa_grant_number: value }),
      });
      if (!res.ok) throw new Error();
      setVisaGrantNumber(value);
      setVisaGrantInput("");
      setVisaGrantEditing(false);
      toast.success("Visa Grant Number saved!");
    } catch {
      toast.error("Failed to save Visa Grant Number.");
    } finally {
      setVisaGrantLoading(false);
    }
  }

  async function handleAddDoc() {
    if (!app) {
      toast.error("Application not loaded yet");
      return;
    }

    const link = docLinkInput.trim();
    if (!link) return setDocError("Please enter a Google Drive link.");
    if (!link.includes("drive.google.com") && !link.includes("docs.google.com"))
      return setDocError("This does not look like a Google Drive link.");
    const fileId = extractFileId(link);
    if (!fileId) return setDocError("Could not find a file ID in this link.");
    setDocError("");
    setDocLoading(true);
    try {
      const res = await fetch(`/api/applications/${app.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: docTitleInput || "Untitled Document",
          link,
        }),
      });
      if (!res.ok) throw new Error();
      const saved: DbDocument = await res.json();
      setDocs((prev) => [...prev, dbDocToDriveDoc(saved, docType)]);
      setDocLinkInput("");
      setDocTitleInput("");
      toast.success("Document added.");
    } catch {
      toast.error("Failed to add document.");
    } finally {
      setDocLoading(false);
    }
  }

  async function handleRemoveDoc(docId: string) {
    if (!app) {
      toast.error("Application not loaded yet");
      return;
    }

    try {
      const res = await fetch(
        `/api/applications/${app.id}/documents/${docId}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();
      setDocs((prev) => prev.filter((d) => d.id !== docId));
      toast.success("Document removed.");
    } catch {
      toast.error("Failed to remove document.");
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors mb-8"
          >
            <I.ArrowLeft /> All Applications
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5 flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-xl font-semibold text-slate-900">
                {app.full_name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {app.passport_number} · {app.visa_type}
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Submitted{" "}
              {new Date(app.created_at).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          {status === "pending" ? (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setConfirm("reject")}
                className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => setConfirm("approve")}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Approve
              </button>
            </div>
          ) : (
            <div
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
            >
              Decision recorded
            </div>
          )}
        </motion.div>

        <div className="space-y-4">
          <Section
            title="Personal Information"
            icon={<I.Person />}
            delay={0.08}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field label="Full Name" value={app.full_name} />
              <Field label="Father's Name" value={app.father_name} />
              <Field label="Mother's Name" value={app.mother_name} />
              <Field label="Email" value={app.email} />
              <Field label="Phone" value={app.phone} />
              <Field label="NID" value={app.nid} mono />
            </div>
          </Section>

          <Section title="Passport & Visa" icon={<I.Passport />} delay={0.13}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Field label="Passport Number" value={app.passport_number} mono />
              <Field
                label="Passport Validity"
                value={new Date(app.passport_validity).toLocaleDateString(
                  "en-AU",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              />
              <Field label="Visa Type" value={app.visa_type} />
            </div>
          </Section>

          <Section title="Addresses" icon={<I.Location />} delay={0.18}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Current Address" value={app.current_address} />
              <Field label="Permanent Address" value={app.permanent_address} />
            </div>
          </Section>

          <Section title="Biometrics" icon={<I.Fingerprint />} delay={0.23}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1.5">
                  Status
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${biometrics === "completed" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${biometrics === "completed" ? "bg-emerald-400" : "bg-amber-400"}`}
                  />
                  {biometrics === "completed" ? "Completed" : "Pending"}
                </span>
              </div>
              <button
                onClick={handleBiometricsToggle}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-xl transition-all"
              >
                Mark as {biometrics === "pending" ? "Completed" : "Pending"}
              </button>
            </div>
          </Section>

          <Section title="Visa Grant Number" icon={<I.Hash />} delay={0.26}>
            {visaGrantNumber && !visaGrantEditing ? (
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
                    Current Visa Grant Number
                  </p>
                  <p className="text-base font-mono font-bold text-slate-800 tracking-widest uppercase">
                    {visaGrantNumber}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setVisaGrantEditing(true);
                    setVisaGrantInput(visaGrantNumber);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Enter the official visa grant number.{" "}
                  <span className="font-semibold text-slate-600">
                    This will be visible to the applicant
                  </span>{" "}
                  when they check their visa status.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        #
                      </span>
                    </span>
                    <input
                      type="text"
                      value={visaGrantInput}
                      onChange={(e) =>
                        setVisaGrantInput(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveVisaGrantNumber()
                      }
                      placeholder="e.g. VGN-2024-000123"
                      className="w-full pl-7 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-300 text-slate-800 font-mono tracking-widest uppercase bg-white"
                    />
                  </div>
                  {visaGrantEditing && (
                    <button
                      onClick={() => {
                        setVisaGrantEditing(false);
                        setVisaGrantInput("");
                      }}
                      className="px-3 py-2 border border-slate-200 text-xs text-slate-400 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSaveVisaGrantNumber}
                    disabled={visaGrantLoading || !visaGrantInput.trim()}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {visaGrantLoading
                      ? "Saving…"
                      : visaGrantEditing
                        ? "Update"
                        : "Save"}
                  </button>
                </div>
                {visaGrantNumber && visaGrantEditing && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    ⚠️ Replacing:{" "}
                    <span className="font-mono font-bold">
                      {visaGrantNumber}
                    </span>
                  </p>
                )}
              </div>
            )}
          </Section>

          <Section title="E-Visa" icon={<I.Link />} delay={0.29}>
            {evisaLink ? (
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
                    Current E-Visa Link
                  </p>
                  <a
                    href={evisaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline font-mono break-all"
                  >
                    {evisaLink}
                  </a>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={evisaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <I.ExternalLink /> Open
                  </a>
                  <button
                    onClick={() => setEvisaLink(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Paste a Google Drive share link. Make sure the file is set to{" "}
                  <span className="font-semibold text-slate-600">
                    "Anyone with the link can view"
                  </span>
                  .
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={evisaInput}
                    onChange={(e) => setEvisaInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEvisa()}
                    placeholder="https://drive.google.com/file/d/…"
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400 text-slate-800 font-mono"
                  />
                  <button
                    onClick={handleSaveEvisa}
                    disabled={evisaLoading}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {evisaLoading ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </Section>

          <Section
            title={`Documents (${docs.length})`}
            icon={<I.Docs />}
            delay={0.33}
          >
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-3">
                Add Document
              </p>
              <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex-[2] min-w-[200px]">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 block mb-1.5">
                    Google Drive Link
                  </label>
                  <input
                    type="text"
                    value={docLinkInput}
                    onChange={(e) => {
                      setDocLinkInput(e.target.value);
                      setDocError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleAddDoc()}
                    placeholder="https://drive.google.com/file/d/…"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400 text-slate-800 font-mono bg-white"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 block mb-1.5">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={docTitleInput}
                    onChange={(e) => setDocTitleInput(e.target.value)}
                    placeholder="e.g. Passport Copy"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400 text-slate-800 bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setDocType("pdf")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${docType === "pdf" ? "bg-red-50 border-red-200 text-red-600" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}
                  >
                    📄 PDF
                  </button>
                  <button
                    onClick={() => setDocType("image")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${docType === "image" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "border-slate-200 text-slate-500 hover:bg-slate-100"}`}
                  >
                    🖼️ Image
                  </button>
                </div>
                <button
                  onClick={handleAddDoc}
                  disabled={docLoading}
                  className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {docLoading ? "Adding…" : "+ Add Document"}
                </button>
              </div>
              {docError && (
                <p className="text-xs text-red-500 mt-2">{docError}</p>
              )}
            </div>

            {docs.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl py-12 text-center">
                <p className="text-3xl mb-2">🗂️</p>
                <p className="text-xs text-slate-400">
                  No documents added yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docs.map((doc) => (
                  <DocCard
                    key={doc.id}
                    doc={doc}
                    onView={setModalDoc}
                    onRemove={handleRemoveDoc}
                  />
                ))}
              </div>
            )}
          </Section>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-6 text-[10px] text-slate-300 mt-6 pb-10 font-mono"
        >
          <span>ID: {app.id}</span>
          <span>
            Updated{" "}
            {new Date(app.updated_at).toLocaleString("en-AU", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </motion.div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <h2 className="text-base font-semibold text-slate-900 mb-1">
                {confirm === "approve"
                  ? "Approve this application?"
                  : "Reject this application?"}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                {confirm === "approve"
                  ? `This will approve the visa application for ${app.full_name} and update their status immediately.`
                  : `This will reject the visa application for ${app.full_name} and update their status immediately.`}
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirm(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(confirm)}
                  disabled={actionLoading}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 ${confirm === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {actionLoading
                    ? "Processing…"
                    : confirm === "approve"
                      ? "Confirm Approval"
                      : "Confirm Rejection"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doc preview modal */}
      <AnimatePresence>
        {modalDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalDoc(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {modalDoc.title}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={modalDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <I.ExternalLink /> Open in Drive
                  </a>
                  <button
                    onClick={() => setModalDoc(null)}
                    className="px-3 py-1.5 border border-slate-200 text-xs text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-slate-100">
                {modalDoc.type === "pdf" ? (
                  <iframe
                    src={getEmbedUrl(modalDoc.fileId, "pdf")}
                    className="w-full border-0 block"
                    style={{ height: "70vh" }}
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={getEmbedUrl(modalDoc.fileId, "image")}
                    alt={modalDoc.title}
                    className="w-full h-auto block object-contain bg-slate-900"
                    style={{ maxHeight: "75vh" }}
                  />
                )}
              </div>
              <p className="px-5 py-2.5 text-[10px] text-slate-400 border-t border-slate-100 bg-slate-50 shrink-0">
                If the file does not load, click "Open in Drive". Ensure file
                sharing is set to "Anyone with the link can view".
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
