"use client";

import { FormEvent, useState } from "react";
import apiService from "@/services/apiService";

const severityOptions = ["low", "medium", "high", "critical"] as const;

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "report">("contact");
  const [contactSubject, setContactSubject] = useState("");
  const [contactBody, setContactBody] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSeverity, setReportSeverity] = useState<typeof severityOptions[number]>("low");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await apiService.support.contact({
        subject: contactSubject,
        body: contactBody,
        email: contactEmail,
      });

      setStatusMessage("Support request sent successfully.");
      setContactSubject("");
      setContactBody("");
      setContactEmail("");
    } catch (error) {
      setErrorMessage("Failed to send support request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await apiService.support.report({
        title: reportTitle,
        description: reportDescription,
        severity: reportSeverity,
      });

      setStatusMessage("Issue report submitted successfully.");
      setReportTitle("");
      setReportDescription("");
      setReportSeverity("low");
    } catch (error) {
      setErrorMessage("Failed to submit issue report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Support Center</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose an option below to contact support or report an issue.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">
          {[
            { id: "contact", label: "Contact Support" },
            { id: "report", label: "Report Issue" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        {(statusMessage || errorMessage) && (
          <div className="mb-6 space-y-3">
            {statusMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{statusMessage}</div>
            )}
            {errorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
            )}
          </div>
        )}

        {activeTab === "contact" && (
          <form onSubmit={handleSubmitContact} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={contactBody}
                onChange={(e) => setContactBody(e.target.value)}
                className="mt-2 h-40 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-[#0f173e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1a2456] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Support Request"}
            </button>
          </form>
        )}

        {activeTab === "report" && (
          <form onSubmit={handleSubmitReport} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Issue Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="mt-2 h-40 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Severity</label>
              <select
                value={reportSeverity}
                onChange={(e) => setReportSeverity(e.target.value as typeof severityOptions[number])}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                {severityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-[#0f173e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1a2456] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Issue Report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}