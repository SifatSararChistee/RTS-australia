"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, User, Mail, Phone, Book, CheckCircle, XCircle, Upload, File as FileIcon, ExternalLink, Calendar } from "lucide-react";
import toast from "react-hot-toast";

type Document = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

type Application = {
  passportNumber: string;
  fullName: string;
  email: string;
  phone: string;
  visaType: string;
  status: string;
  message: string;
  createdAt: string;
  documents: Document[];
};

export default function AdminReviewPage({ params }: { params: { passport: string } }) {
  const router = useRouter();
  const passportNumber = params.passport;
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/status/${passportNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApp(data.application);
        } else {
          toast.error("Application not found.");
          router.push("/admin");
        }
      })
      .finally(() => setLoading(false));
  }, [passportNumber, router]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passportNumber, status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        setApp({ ...app!, status: newStatus });
        if (data.emailPreviewUrl) {
           toast.success(`Approval Email Sent! Check preview in console.`, { duration: 5000 });
           console.log("Ethereal Email Preview:", data.emailPreviewUrl);
        }
      } else {
        toast.error(data.error || "Failed to update status.");
      }
    } catch {
      toast.error("Error updating status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("passportNumber", passportNumber);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Document uploaded securely.");
        setApp({ ...app!, documents: [...app!.documents, data.document] });
      } else {
        toast.error(data.error || "Upload failed.");
      }
    } catch {
      toast.error("Upload error.");
    } finally {
      setUploading(false);
      // reset file input
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-rts-blue animate-spin" />
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.push("/admin")}
          className="flex items-center text-gray-500 hover:text-rts-blue font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-rts-blue p-6 text-white flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">{app.fullName}</h1>
                  <p className="text-blue-200 flex items-center mt-1">
                    <User className="w-4 h-4 mr-2" /> {app.passportNumber}
                  </p>
                </div>
                <div className="text-right">
                   <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white text-rts-blue`}>
                     {app.status}
                   </div>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><Mail className="w-4 h-4 mr-2"/> Email Address</dt>
                  <dd className="mt-1 text-gray-900 font-medium">{app.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><Phone className="w-4 h-4 mr-2"/> Phone Number</dt>
                  <dd className="mt-1 text-gray-900 font-medium">{app.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><Book className="w-4 h-4 mr-2"/> Visa Type</dt>
                  <dd className="mt-1 text-gray-900 font-medium">{app.visaType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Applied On</dt>
                  <dd className="mt-1 text-gray-900 font-medium">{new Date(app.createdAt).toLocaleDateString()}</dd>
                </div>
                {app.message && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Applicant Message</dt>
                    <dd className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">{app.message}</dd>
                  </div>
                )}
              </div>
            </div>

            {/* Document Management */}
            <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Secure Documents</h2>
                
                <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${app.status !== 'Approved' ? 'bg-gray-400 cursor-not-allowed' : 'bg-rts-blue hover:bg-blue-800'}`}>
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload File
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    disabled={app.status !== 'Approved' || uploading}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
              </div>
              
              {app.status !== 'Approved' && (
                <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-6">
                  Note: You must <strong>Approve</strong> this application before linking secure documents.
                </p>
              )}

              <div className="space-y-3">
                {app.documents.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">No documents linked to this passport yet.</p>
                ) : (
                  app.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center text-gray-900 font-medium">
                        <FileIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="truncate max-w-[200px] sm:max-w-xs">{doc.fileName}</span>
                      </div>
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-rts-blue hover:text-blue-800 flex items-center font-semibold text-sm">
                        View <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Column */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Review Actions</h2>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleStatusUpdate('Approved')}
                  disabled={updating || app.status === 'Approved'}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Approve Application
                </button>
                
                <button 
                  onClick={() => handleStatusUpdate('Rejected')}
                  disabled={updating || app.status === 'Rejected'}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="w-5 h-5 mr-2" /> Reject Application
                </button>

                <div className="pt-6 border-t border-gray-200 mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Stage Manually</label>
                  <select 
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updating}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rts-blue focus:border-rts-blue sm:text-sm rounded-md border"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Biometrics Pending">Biometrics Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
