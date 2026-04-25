"use client";

import { ApplicationStatus, fakeApplications } from "@/lib/fakeData";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-sm text-gray-800">{value || "—"}</p>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [appStatus, setAppStatus] = useState<ApplicationStatus | null>(null);
  const [showConfirm, setShowConfirm] = useState<"approve" | "reject" | null>(
    null,
  );
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [visaFile, setVisaFile] = useState<File | null>(null);

  const app = fakeApplications.find((a) => a.id === id);

  if (!app) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Application not found.</p>
        <Link
          href="/admin/dashboard"
          className="text-blue-600 text-sm mt-2 inline-block"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentStatus = appStatus ?? app.status;

  async function handleAction(action: "approve" | "reject") {
    setLoading(true);
    // Simulate API call — replace with real DB call later
    await new Promise((r) => setTimeout(r, 800));
    setAppStatus(action === "approve" ? "approved" : "rejected");
    setShowConfirm(null);
    setAdminNote("");
    setLoading(false);
  }

  async function handleUploadVisa() {
    if (!visaFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", visaFile);
      formData.append("passportNumber", app!.passportNumber);

      const res = await fetch("/api/upload-visa", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("E-Visa uploaded successfully!");
      setVisaFile(null);
    } catch (err: any) {
      toast.error(err.message || "An error occurred during upload");
    } finally {
      setUploadLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
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
        All Applications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {app.fullName}
            </h1>
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[currentStatus]}`}
            >
              {STATUS_LABELS[currentStatus]}
            </span>
          </div>
          <p className="text-sm text-gray-400 font-mono">
            {app.id} · {app.visaType}
          </p>
        </div>

        {/* Actions */}
        {currentStatus === "pending" || currentStatus === "under_review" ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm("reject")}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => setShowConfirm("approve")}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
          </div>
        ) : (
          <div
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentStatus === "approved"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            Decision recorded
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {showConfirm === "approve"
                ? "Approve Application?"
                : "Reject Application?"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {showConfirm === "approve"
                ? `This will approve the visa application for ${app.fullName}.`
                : `This will reject the visa application for ${app.fullName}.`}
            </p>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Admin note (optional)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                placeholder="Add a note for internal records..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(showConfirm)}
                disabled={loading}
                className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                  showConfirm === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-60`}
              >
                {loading
                  ? "Processing..."
                  : showConfirm === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="space-y-5">
        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Personal Information
          </h2>
          <div className="grid grid-cols-3 gap-5">
            <Field label="Full Name" value={app.fullName} />
            <Field
              label="Date of Birth"
              value={new Date(app.dateOfBirth).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <Field label="Nationality" value={app.nationality} />
            <Field label="Passport Number" value={app.passportNumber} />
            <Field label="Email" value={app.email} />
            <Field label="Phone" value={app.phone} />
            <Field label="Address" value={app.address} />
            <Field label="Occupation" value={app.occupation} />
            <Field label="Employer" value={app.employer} />
          </div>
        </div>

        {/* Visa Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Visa Details
          </h2>
          <div className="grid grid-cols-3 gap-5">
            <Field label="Visa Type" value={app.visaType} />
            <Field
              label="Intended Arrival"
              value={new Date(app.intendedArrival).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <Field
              label="Intended Departure"
              value={
                app.intendedDeparture === "N/A (permanent)"
                  ? "N/A (permanent)"
                  : new Date(app.intendedDeparture).toLocaleDateString(
                      "en-AU",
                      { day: "numeric", month: "long", year: "numeric" },
                    )
              }
            />
            <div className="col-span-3">
              <Field label="Purpose of Visit" value={app.purposeOfVisit} />
            </div>
          </div>
        </div>

        {/* Notes */}
        {app.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h2 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
              Applicant Notes
            </h2>
            <p className="text-sm text-amber-800">{app.notes}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            E-Visa Upload
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setVisaFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <button
              onClick={handleUploadVisa}
              disabled={uploadLoading || !visaFile}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {uploadLoading ? "Uploading..." : "Upload Visa"}
            </button>
          </div>
          {visaFile && (
            <p className="mt-2 text-xs text-gray-500">
              Selected file: {visaFile.name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-400 pb-4">
          <span>
            Submitted {new Date(app.submittedAt).toLocaleString("en-AU")}
          </span>
          <span>Application ID: {app.id}</span>
        </div>
      </div>
    </div>
  );
}
