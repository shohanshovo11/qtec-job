"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Send, User, Mail, Link2, FileText } from "lucide-react";
import { ApiJob, apiClient, getApiErrorMessage } from "@/lib/api";

interface ApplyFormProps {
  job: ApiJob;
}

export default function ApplyForm({ job }: ApplyFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    resumeUrl: "",
    coverNote: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.resumeUrl.trim()) {
      e.resumeUrl = "Resume link is required.";
    } else {
      try {
        new URL(form.resumeUrl);
      } catch {
        e.resumeUrl = "Please enter a valid URL (e.g. https://…).";
      }
    }
    if (!form.coverNote.trim()) e.coverNote = "Cover note is required.";
    else if (form.coverNote.trim().length < 50)
      e.coverNote = "Cover note must be at least 50 characters.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await apiClient.post("/api/applications", {
        jobId: job._id,
        name: form.name,
        email: form.email,
        resumeUrl: form.resumeUrl,
        coverNote: form.coverNote,
      });
      setLoading(false);
      setSubmitted(true);
      toast.success("Application sent!", {
        description: `Your application for ${job.title} at ${job.company} has been submitted.`,
        duration: 5000,
      });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to submit application."));
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-8 px-4">
        <div className="w-16 h-16 bg-[#E8F5F0] flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#14A077"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h3
            className="text-lg font-bold text-[var(--text-primary)] mb-1"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            Application Submitted!
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs">
            We&apos;ve sent your application for{" "}
            <span className="font-semibold">{job.title}</span> at{" "}
            <span className="font-semibold">{job.company}</span>. Expect to hear
            back within 5–7 business days.
          </p>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", resumeUrl: "", coverNote: "" });
            setErrors({});
          }}
          className="text-sm text-[var(--action-primary)] font-semibold hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="name"
          className="text-sm font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
        >
          Full Name <span className="text-[var(--danger)]">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <Input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => {
              setForm((f) => ({ ...f, name: e.target.value }));
              setErrors((err) => ({ ...err, name: undefined }));
            }}
            placeholder="Jane Doe"
            className={`pl-9 rounded-none border-[var(--border-subtle)] focus-visible:border-[var(--action-primary)] focus-visible:ring-0 h-11 text-sm ${errors.name ? "border-[var(--danger)]" : ""}`}
            aria-invalid={!!errors.name}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-[var(--danger)]">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="email"
          className="text-sm font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
        >
          Email Address <span className="text-[var(--danger)]">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }));
              setErrors((err) => ({ ...err, email: undefined }));
            }}
            placeholder="jane@example.com"
            className={`pl-9 rounded-none border-[var(--border-subtle)] focus-visible:border-[var(--action-primary)] focus-visible:ring-0 h-11 text-sm ${errors.email ? "border-[var(--danger)]" : ""}`}
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-[var(--danger)]">{errors.email}</p>
        )}
      </div>

      {/* Resume URL */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="resumeUrl"
          className="text-sm font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
        >
          Resume / CV Link <span className="text-[var(--danger)]">*</span>
        </Label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <Input
            id="resumeUrl"
            type="url"
            value={form.resumeUrl}
            onChange={(e) => {
              setForm((f) => ({ ...f, resumeUrl: e.target.value }));
              setErrors((err) => ({ ...err, resumeUrl: undefined }));
            }}
            placeholder="https://drive.google.com/your-resume"
            className={`pl-9 rounded-none border-[var(--border-subtle)] focus-visible:border-[var(--action-primary)] focus-visible:ring-0 h-11 text-sm ${errors.resumeUrl ? "border-[var(--danger)]" : ""}`}
            aria-invalid={!!errors.resumeUrl}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Google Drive, Dropbox, LinkedIn, or any public URL.
        </p>
        {errors.resumeUrl && (
          <p className="text-xs text-[var(--danger)]">{errors.resumeUrl}</p>
        )}
      </div>

      {/* Cover Note */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="coverNote"
            className="text-sm font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
          >
            Cover Note <span className="text-[var(--danger)]">*</span>
          </Label>
          <span className="text-xs text-[var(--text-muted)]">
            {form.coverNote.length} / 1000
          </span>
        </div>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <Textarea
            id="coverNote"
            value={form.coverNote}
            onChange={(e) => {
              if (e.target.value.length <= 1000) {
                setForm((f) => ({ ...f, coverNote: e.target.value }));
                setErrors((err) => ({ ...err, coverNote: undefined }));
              }
            }}
            placeholder={`Tell ${job.company} why you're a great fit for this role. Highlight relevant experience, skills, and what excites you about this opportunity.`}
            className={`pl-9 pt-2.5 rounded-none border-[var(--border-subtle)] focus-visible:border-[var(--action-primary)] focus-visible:ring-0 min-h-[130px] text-sm resize-none ${errors.coverNote ? "border-[var(--danger)]" : ""}`}
            aria-invalid={!!errors.coverNote}
          />
        </div>
        {errors.coverNote && (
          <p className="text-xs text-[var(--danger)]">{errors.coverNote}</p>
        )}
      </div>

      <Separator className="my-1" />

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 text-sm font-semibold rounded-none bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white gap-2 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Application
          </>
        )}
      </Button>

      <p className="text-xs text-center text-[var(--text-muted)]">
        By submitting, you agree to our{" "}
        <a href="#" className="text-[var(--action-primary)] hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
