"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CreditCard,
  Download,
  FileText,
  Hash,
  Loader2,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";

type Document = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

type ApplicationResult = {
  passportNumber: string;
  fullName: string;
  status: string;
  documents: Document[];
};

type FormFields = {
  fullName: string;
  passportNumber: string;
  visaGrantNumber: string;
};

// ── helper functions ──────────────────────────────────────────────
function getFileId(url: string): string {
  const idFromPath = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (idFromPath) return idFromPath[1];

  const idFromQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idFromQuery) return idFromQuery[1];

  return "";
}

function getFileType(url: string, title: string): "pdf" | "image" {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const isImage = imageExtensions.some(
    (ext) =>
      url.toLowerCase().includes(ext) || title.toLowerCase().includes(ext),
  );
  return isImage ? "image" : "pdf";
}

function getEmbedUrl(
  fileId: string,
  type: "pdf" | "image",
  fallbackUrl: string,
) {
  if (!fileId) return fallbackUrl;
  return type === "pdf"
    ? `https://drive.google.com/file/d/${fileId}/preview?usp=sharing`
    : `https://drive.google.com/uc?export=view&id=${fileId}`;
}
// ─────────────────────────────────────────────────────────────────

const inputFields = [
  {
    key: "fullName" as keyof FormFields,
    label: "Full Name",
    placeholder: "As shown on passport",
    icon: User,
    type: "text",
    transform: (v: string) => v,
  },
  {
    key: "passportNumber" as keyof FormFields,
    label: "Passport Number",
    placeholder: "e.g. A12345678",
    icon: CreditCard,
    type: "text",
    transform: (v: string) => v.toUpperCase(),
  },
  {
    key: "visaGrantNumber" as keyof FormFields,
    label: "Visa Grant Number",
    placeholder: "e.g. VGN-2024-000123",
    icon: Hash,
    type: "text",
    transform: (v: string) => v.toUpperCase(),
  },
];

export default function CheckVisaPage() {
  const [form, setForm] = useState<FormFields>({
    fullName: "",
    passportNumber: "",
    visaGrantNumber: "",
  });

  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalDoc, setModalDoc] = useState<{
    title: string;
    url: string;
    fileId: string;
    type: "pdf" | "image";
  } | null>(null);

  const isFormComplete = Object.values(form).every(
    (value) => value.trim() !== "",
  );

  const handleChange = (key: keyof FormFields, value: string) => {
    const field = inputFields.find((item) => item.key === key);
    setForm((prev) => ({
      ...prev,
      [key]: field ? field.transform(value) : value,
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    setErrorMsg(null);
    setResult(null);
    setHasScanned(false);
    setIsScanning(true);

    try {
      const audio = new Audio("/scanning.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}

    setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          fullName: form.fullName,
          passportNumber: form.passportNumber,
          visaGrantNumber: form.visaGrantNumber,
        });

        const res = await fetch(`/api/visa-status?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(
            data.error ||
              "No matching record found. Please ensure all details are correct.",
          );
        } else {
          setResult(data.application);
        }
      } catch (error) {
        console.log(error);
        setErrorMsg(
          "We are experiencing connection issues. Please try again later.",
        );
      } finally {
        setIsScanning(false);
        setHasScanned(true);
      }
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "biometrics pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-12 mt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6"
        >
          <ShieldCheck className="h-8 w-8 text-rts-blue" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Visa Status Portal
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Enter the three details below exactly as shown on your documents.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        {/* Form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {inputFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-1.5"
                >
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      required
                      type={field.type}
                      value={form[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                      focus:ring-4 focus:ring-rts-blue/10 focus:border-rts-blue
                      outline-none transition-all ${
                        field.key === "passportNumber" ||
                        field.key === "visaGrantNumber"
                          ? "uppercase tracking-widest"
                          : ""
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 text-center mb-6">
            Full name, passport number and visa grant number are required.
          </p>

          <button
            type="submit"
            disabled={!isFormComplete || isScanning}
            className="w-full flex items-center justify-center gap-2 py-4 bg-rts-blue hover:bg-blue-900 text-white font-bold rounded-2xl transition-all disabled:opacity-60"
          >
            {isScanning ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Verifying Records...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Check Visa Status
              </>
            )}
          </button>
        </motion.form>

        {/* Loading */}
        {isScanning && (
          <div className="text-center py-10 text-slate-400">
            Verifying secure records...
          </div>
        )}

        {/* Error */}
        {hasScanned && !isScanning && errorMsg && (
          <div className="bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-sm">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No Matching Record Found
            </h3>
            <p className="text-slate-500">{errorMsg}</p>
          </div>
        )}

        {/* Result */}
        {hasScanned && !isScanning && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg">
                Applicant Profile
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${getStatusColor(result.status)}`}
              >
                {result.status}
              </span>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Full Name
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {result.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Passport Number
                  </p>
                  <p className="text-xl font-bold text-rts-blue">
                    {result.passportNumber}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-6">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400" />
                  Visa Documents
                </h4>

                {result.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.documents.map((doc) => {
                      const fileId = getFileId(doc.fileUrl);
                      const type = getFileType(doc.fileUrl, doc.fileName);
                      return (
                        <div
                          key={doc.id}
                          className="group relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-200"
                        >
                          {/* Thumbnail */}
                          <div className="relative h-36 bg-slate-100 border-b border-slate-200 overflow-hidden">
                            <img
                              src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w400`}
                              alt={doc.fileName}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (
                                  e.currentTarget as HTMLImageElement
                                ).style.display = "none";
                              }}
                            />
                          </div>

                          {/* Card body */}
                          <div className="flex flex-col flex-1 p-4 gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800 text-sm leading-snug capitalize line-clamp-2">
                                {doc.fileName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() =>
                                  setModalDoc({
                                    title: doc.fileName,
                                    url: doc.fileUrl,
                                    fileId,
                                    type,
                                  })
                                }
                                className="flex-1 py-2 text-xs font-semibold text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                              >
                                Preview
                              </button>
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 rounded-xl transition-colors text-center"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">
                      No documents uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

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
                    src={getEmbedUrl(modalDoc.fileId, "pdf", modalDoc.url)}
                    className="w-full border-0 block"
                    style={{ height: "70vh" }}
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={getEmbedUrl(modalDoc.fileId, "image", modalDoc.url)}
                    alt={modalDoc.title}
                    className="w-full h-auto block object-contain bg-slate-900"
                    style={{ maxHeight: "75vh" }}
                  />
                )}
              </div>

              <p className="px-5 py-2.5 text-[10px] text-slate-400 border-t border-slate-100 bg-slate-50 shrink-0">
                If the file does not load, click Open File. Ensure sharing is
                set to Anyone with the link can view.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
