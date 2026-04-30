"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Download,
  FileText,
  Loader2,
  PartyPopper,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// ✅ Matches real Supabase schema exactly
type Document = {
  id: string;
  title: string;
  link: string;
  uploaded_at: string;
};

type Application = {
  id: string;
  full_name: string;
  passport_number: string;
  passport_validity: string;
  email: string;
  phone: string;
  nid: string;
  visa_type: string;
  current_address: string;
  permanent_address: string;
  father_name: string;
  mother_name: string;
  status: "approved" | "pending" | "rejected";
  evisa_link: string | null;
  visa_grant_number: string | null;
  biometrics_status: "completed" | "pending" | "not_required";
  created_at: string;
  updated_at: string;
  documents: Document[];
};

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
  pending: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function DocumentCheckPage() {
  const [passportNumber, setPassportNumber] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [result, setResult] = useState<Application | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalDoc, setModalDoc] = useState<{
    title: string;
    url: string;
    fileId: string;
    type: "pdf" | "image";
  } | null>(null);

  function getFileId(url: string): string {
    const idFromPath = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (idFromPath) return idFromPath[1];

    const idFromQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idFromQuery) return idFromQuery[1];

    const idFromOpen = url.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
    if (idFromOpen) return idFromOpen[1];

    return "";
  }

  function getFileType(url: string, title: string): "pdf" | "image" {
    const lowerUrl = url.toLowerCase();
    const lowerTitle = title.toLowerCase();

    if (
      lowerUrl.includes(".pdf") ||
      lowerTitle.includes(".pdf") ||
      lowerUrl.includes("mime=pdf") ||
      lowerUrl.includes("export=download")
    ) {
      return "pdf";
    }

    return "image";
  }

  function getEmbedUrl(
    fileId: string,
    type: "pdf" | "image",
    fallbackUrl: string,
  ) {
    if (!fileId) {
      return fallbackUrl;
    }

    return type === "pdf"
      ? `https://drive.google.com/file/d/${fileId}/preview?usp=sharing`
      : `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNumber.trim()) return;

    setErrorMsg(null);
    setResult(null);
    setIsScanning(true);
    setHasScanned(false);

    // Artificial delay for UX scanning effect
    await new Promise((r) => setTimeout(r, 1500));

    try {
      const res = await fetch(
        `/api/status/${encodeURIComponent(passportNumber.trim())}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data.error || "No application record found for this passport number.",
        );
      } else {
        // ✅ data is already the Application object — no wrapping needed
        setResult(data);
      }
    } catch {
      setErrorMsg("Connection error. Please try again later.");
    } finally {
      setIsScanning(false);
      setHasScanned(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      <div className="text-center mb-12 mt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6"
        >
          <FileText className="h-8 w-8 text-blue-700" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Document Verification Center
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Review your submitted application details and download official
          documents issued by the admin.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="relative mb-16 group max-w-2xl mx-auto"
        >
          <div className="relative flex items-center shadow-sm group-focus-within:shadow-md transition-shadow duration-300 rounded-3xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="block w-full pr-36 py-6 rounded-3xl border border-slate-200 bg-white focus:ring-4 focus:ring-blue-700/10 focus:border-blue-700 outline-none transition-all placeholder:text-slate-300 uppercase text-lg font-medium shadow-sm"
              placeholder="ENTER PASSPORT NUMBER"
              style={{ paddingLeft: "3.25rem" }}
            />
            <button
              type="submit"
              disabled={isScanning || !passportNumber.trim()}
              className="absolute right-2 px-6 py-3 bg-blue-700 hover:bg-blue-900 text-white font-bold rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center shadow-lg shadow-blue-900/20"
            >
              {isScanning ? (
                <Loader2 className="animate-spin w-5 h-5 mx-2" />
              ) : (
                "Verify Documents"
              )}
            </button>
          </div>
        </form>

        {/* Scanning animation */}
        {isScanning && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-700 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-700 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-slate-400 font-medium animate-pulse tracking-widest text-xs uppercase">
              Retrieving encrypted documents...
            </p>
          </div>
        )}

        {/* Error state */}
        {hasScanned && !isScanning && errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No Record Found
            </h3>
            <p className="text-slate-500">{errorMsg}</p>
          </motion.div>
        )}

        {/* Result */}
        {hasScanned && !isScanning && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
          >
            {/* Approved banner */}
            {result.status === "approved" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-emerald-50 border-b border-emerald-100 px-8 py-6 flex items-center gap-4"
              >
                <div className="p-2 bg-emerald-100 rounded-full">
                  <PartyPopper className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-emerald-800 font-bold text-lg">
                    Congratulations!
                  </h3>
                  <p className="text-emerald-600 text-sm">
                    Your Application has been approved by admin.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Header bar */}
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="text-white font-semibold text-lg">
                  Application Details
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${STATUS_STYLES[result.status] ?? STATUS_STYLES.pending}`}
              >
                {result.status}
              </span>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Personal info — all from real DB fields */}
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User className="w-5 h-5 text-slate-400" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: "Full Name", value: result.full_name },
                      {
                        label: "Passport Number",
                        value: result.passport_number,
                      },
                      {
                        label: "Passport Validity",
                        value: result.passport_validity,
                      },
                      { label: "NID", value: result.nid },
                      { label: "Father's Name", value: result.father_name },
                      { label: "Mother's Name", value: result.mother_name },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between py-2 border-b border-slate-50"
                      >
                        <span className="text-sm text-slate-400 font-medium">
                          {label}
                        </span>
                        <span className="text-sm font-bold text-slate-900 text-right">
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & visa info */}
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-slate-400" />
                    Contact &amp; Visa
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: "Email", value: result.email },
                      { label: "Phone", value: result.phone },
                      { label: "Visa Type", value: result.visa_type },
                      {
                        label: "Visa Grant Number",
                        value: result.visa_grant_number,
                      },
                      { label: "Biometrics", value: result.biometrics_status },
                      {
                        label: "Current Address",
                        value: result.current_address,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between py-2 border-b border-slate-50"
                      >
                        <span className="text-sm text-slate-400 font-medium">
                          {label}
                        </span>
                        <span className="text-sm font-bold text-slate-900 text-right max-w-[180px] leading-tight capitalize">
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents */}
              {(result.documents ?? []).length === 0 ? (
                <p className="text-sm text-slate-400">
                  No documents uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(result.documents ?? []).map((doc) => {
                    const fileId = getFileId(doc.link);
                    const type = getFileType(doc.link, doc.title);

                    return (
                      <div
                        key={doc.id}
                        className="group relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-200"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-36 bg-slate-100 border-b border-slate-200 overflow-hidden">
                          <Image
                            src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w400`}
                            alt={doc.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw,
                                   (max-width: 1024px) 50vw,
                                   33vw"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                        </div>

                        <div className="flex flex-col flex-1 p-4 gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 text-sm leading-snug capitalize line-clamp-2">
                              {doc.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(doc.uploaded_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() =>
                                setModalDoc({
                                  title: doc.title,
                                  url: doc.link,
                                  fileId,
                                  type,
                                })
                              }
                              className="flex-1 py-2 text-xs font-semibold text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                            >
                              Preview
                            </button>
                            <a
                              href={doc.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" /> Download
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Preview Modal */}
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
                      {/* Modal header */}
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
                            <Download className="w-3.5 h-3.5" /> Open File
                          </a>
                          <button
                            onClick={() => setModalDoc(null)}
                            className="px-3 py-1.5 border border-slate-200 text-xs text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            ✕ Close
                          </button>
                        </div>
                      </div>

                      {/* Modal content */}
                      <div className="flex-1 overflow-auto bg-slate-100">
                        {modalDoc.type === "pdf" ? (
                          <iframe
                            src={getEmbedUrl(
                              modalDoc.fileId,
                              "pdf",
                              modalDoc.url,
                            )}
                            className="w-full border-0 block"
                            style={{ height: "70vh" }}
                            allowFullScreen
                          />
                        ) : (
                          <img
                            src={getEmbedUrl(
                              modalDoc.fileId,
                              "image",
                              modalDoc.url,
                            )}
                            alt={modalDoc.title}
                            className="w-full h-auto block object-contain bg-slate-900"
                            style={{ maxHeight: "75vh" }}
                          />
                        )}
                      </div>

                      <p className="px-5 py-2.5 text-[10px] text-slate-400 border-t border-slate-100 bg-slate-50 shrink-0">
                        If the file does not load, click "Open File". Ensure
                        sharing is set to "Anyone with the link can view".
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
