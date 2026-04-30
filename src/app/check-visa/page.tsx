"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CreditCard,
  FileDown,
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
  dateOfBirth: string;
};

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
  {
    key: "dateOfBirth" as keyof FormFields,
    label: "Date of Birth",
    placeholder: "",
    icon: Calendar,
    type: "date",
    transform: (v: string) => v,
  },
];

export default function CheckVisaPage() {
  const [form, setForm] = useState<FormFields>({
    fullName: "",
    passportNumber: "",
    visaGrantNumber: "",
    dateOfBirth: "",
  });
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isFormComplete = Object.values(form).every((v) => v.trim() !== "");

  const handleChange = (key: keyof FormFields, value: string) => {
    const field = inputFields.find((f) => f.key === key);
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
    setIsScanning(true);
    setHasScanned(false);

    try {
      const audio = new Audio("/scanning.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {
      // Ignore audio errors quietly
    }

    setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          passportNumber: form.passportNumber,
          fullName: form.fullName,
          visaGrantNumber: form.visaGrantNumber,
          dateOfBirth: form.dateOfBirth,
        });

        const res = await fetch(`/api/status?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(
            data.error ||
              "No matching record found. Please ensure all details are correct.",
          );
        } else {
          setResult(data.application);
        }
      } catch (err) {
        setErrorMsg(
          "We are experiencing connection issues. Please try again later.",
        );
        console.log(err);
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
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      {/* Header */}
      <div className="text-center mb-12 mt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6"
        >
          <ShieldCheck className="h-8 w-8 text-rts-blue" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Visa Status Portal
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Enter all four details below exactly as they appear on your documents.
          All fields must match our records to retrieve your application.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {inputFields.map((field, idx) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="flex flex-col gap-1.5"
                >
                  <label
                    htmlFor={field.key}
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id={field.key}
                      type={field.type}
                      required
                      value={form[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                        focus:ring-4 focus:ring-rts-blue/10 focus:border-rts-blue focus:bg-white
                        outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300
                        ${
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

          {/* Divider hint */}
          <p className="text-xs text-slate-400 text-center mb-6">
            All four fields are required and must match your official records.
          </p>

          <button
            type="submit"
            disabled={isScanning || !isFormComplete}
            className="w-full flex items-center justify-center gap-2 py-4 bg-rts-blue hover:bg-blue-900
              text-white font-bold rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed
              shadow-lg shadow-blue-900/20 text-base"
          >
            {isScanning ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Verifying Records…
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Check Visa Status
              </>
            )}
          </button>
        </motion.form>

        {/* Scanning state */}
        {isScanning && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-rts-blue rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-rts-blue animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-slate-400 font-medium animate-pulse tracking-widest text-xs uppercase">
              Verifying secure records…
            </p>
          </div>
        )}

        {/* Error state */}
        {hasScanned && !isScanning && errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-sm"
          >
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No Matching Record Found
            </h3>
            <p className="text-slate-500">{errorMsg}</p>
            <p className="mt-3 text-xs text-slate-400">
              Please double-check your name, passport number, visa grant number,
              and date of birth, then try again.
            </p>
          </motion.div>
        )}

        {/* Result card */}
        {hasScanned && !isScanning && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="text-white font-semibold text-lg">
                  Applicant Profile
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(result.status)}`}
              >
                {result.status}
              </span>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Full Name
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {result.fullName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Passport Number
                  </p>
                  <p className="text-xl font-mono font-bold text-rts-blue uppercase tracking-tight">
                    {result.passportNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-slate-400" />
                  Visa Documents
                </h4>

                {result.documents && result.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {result.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all group hover:border-rts-blue/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg border border-slate-200 group-hover:border-rts-blue/30">
                            <FileText className="w-4 h-4 text-slate-400 group-hover:text-rts-blue" />
                          </div>
                          <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                            {doc.fileName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-rts-blue group-hover:translate-x-1 transition-transform">
                          Download <FileDown className="w-4 h-4" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">
                      No documents have been uploaded to your profile yet.
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Check back later or contact RTS support.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
