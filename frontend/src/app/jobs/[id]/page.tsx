import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchJobById, fetchJobs } from "@/lib/api";
import Navbar from "../../components/Navbar";

export const dynamic = "force-dynamic";
import Footer from "../../components/Footer";
import ApplyForm from "./ApplyForm";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  Users,
  DollarSign,
  ExternalLink,
  CheckCircle2,
  Star,
  Gift,
} from "lucide-react";

const TYPE_STYLES: Record<string, string> = {
  "Full Time": "bg-[#E8F5F0] text-[#14A077]",
  "Part Time": "bg-[#FFF6E6] text-[#E88A00]",
  Remote: "bg-[#EEF0FF] text-[#4640DE]",
  Contract: "bg-[#FFE9E9] text-[#E05151]",
  Internship: "bg-[#F2ECFF] text-[#7B2FBE]",
};

const TAG_STYLES: Record<string, string> = {
  Design: "bg-[#E8F5F0] text-[#14A077]",
  Marketing: "bg-[#FFF6E6] text-[#E88A00]",
  Business: "bg-[#EEF0FF] text-[#4640DE]",
  Technology: "bg-[#FFE9E9] text-[#E05151]",
  Engineering: "bg-[#E8F0FF] text-[#2563EB]",
  Finance: "bg-[#FEF9C3] text-[#A16207]",
  Sales: "bg-[#FCE7F3] text-[#BE185D]",
  "Human Resource": "bg-[#F2ECFF] text-[#7B2FBE]",
};

function getTagStyle(tag: string): string {
  for (const [key, val] of Object.entries(TAG_STYLES)) {
    if (tag.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return "bg-[var(--color-brand-100)] text-[var(--action-primary)]";
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await fetchJobById(id);

  if (!job) notFound();

  const relatedData = await fetchJobs({
    category: job.category,
    limit: "4",
    sortBy: "newest",
  });
  const relatedJobs = (relatedData.data ?? [])
    .filter((j) => j._id !== job._id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F8F8FD]">
      <Navbar />
      <Toaster position="top-right" richColors />

      {/* ── Hero banner ── */}
      <section className="w-full bg-white border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
            <Link
              href="/"
              className="hover:text-[var(--action-primary)] transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/jobs"
              className="hover:text-[var(--action-primary)] transition-colors"
            >
              Find Jobs
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-medium truncate max-w-[200px]">
              {job.title}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Left: logo + title */}
            <div className="flex items-start gap-5 flex-1">
              <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 border border-[var(--border-subtle)] flex items-center justify-center bg-[var(--color-neutral-50)]">
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1
                    className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)]"
                    style={{
                      fontFamily:
                        "var(--font-sora), var(--font-epilogue), sans-serif",
                    }}
                  >
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-[#FFF6E6] text-[#E88A00] border border-[#E88A00]/20">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {job.company}
                  </span>
                  <span className="text-[var(--border-strong)]">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {job.location}
                  </span>
                  <span className="text-[var(--border-strong)]">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    Posted {job.postedAt}
                  </span>
                </div>

                {/* Meta pills */}
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <span
                    className={`text-xs font-semibold px-3 py-1 border border-current ${TYPE_STYLES[job.type] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {job.type}
                  </span>
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs font-medium px-2.5 py-1 ${getTagStyle(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: salary + quick stats */}
            <div className="flex flex-col gap-4 lg:items-end shrink-0">
              <div className="text-right">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium">
                  Salary Range
                </p>
                <p
                  className="text-2xl font-bold text-[var(--action-primary)]"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  {job.salary}
                </p>
                <p className="text-xs text-[var(--text-muted)]">per annum</p>
              </div>
              <div className="flex gap-5">
                <div className="text-center lg:text-right">
                  <p className="text-base font-bold text-[var(--text-primary)]">
                    {job.applicants}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Applicants</p>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-base font-bold text-[var(--text-primary)]">
                    {job.experience}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Left: Job content ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {/* About the role */}
            <div className="bg-white border border-[var(--border-subtle)] p-7">
              <h2
                className="text-xl font-bold text-[var(--text-primary)] mb-4"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                About the Role
              </h2>
              <p
                className="text-[var(--text-secondary)] text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
              >
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white border border-[var(--border-subtle)] p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[var(--color-brand-100)] flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-[var(--action-primary)]" />
                </div>
                <h2
                  className="text-xl font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  What You&apos;ll Do
                </h2>
              </div>
              <ul className="flex flex-col gap-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#14A077] mt-0.5 shrink-0" />
                    <span
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white border border-[var(--border-subtle)] p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[#FFF6E6] flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-[#E88A00]" />
                </div>
                <h2
                  className="text-xl font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  What We&apos;re Looking For
                </h2>
              </div>
              <ul className="flex flex-col gap-3 mb-6">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--action-primary)] mt-2 shrink-0" />
                    <span
                      className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {job.niceToHave.length > 0 && (
                <>
                  <Separator className="mb-5" />
                  <h3
                    className="text-sm font-semibold text-[var(--text-primary)] mb-3"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    Nice to Have
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {job.niceToHave.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)] mt-2 shrink-0" />
                        <span
                          className="text-sm text-[var(--text-muted)] leading-relaxed"
                          style={{
                            fontFamily: "var(--font-epilogue), sans-serif",
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-white border border-[var(--border-subtle)] p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[#E8F0FF] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-[#2563EB]" />
                </div>
                <h2
                  className="text-xl font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  Perks &amp; Benefits
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 bg-[var(--color-neutral-50)] border border-[var(--border-subtle)]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--action-primary)] mt-0.5 shrink-0" />
                    <span
                      className="text-sm text-[var(--text-secondary)] leading-snug"
                      style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* About the company */}
            <div className="p-7 border border-[var(--action-primary)]/20 bg-[var(--color-brand-50)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[var(--color-brand-100)] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-[var(--action-primary)]" />
                </div>
                <h2
                  className="text-xl font-bold text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  About {job.company}
                </h2>
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5"
                style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
              >
                {job.aboutCompany}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">
                    {job.companySize}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">
                    {job.salary}
                  </span>
                </div>
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--action-primary)] font-semibold hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit Website
                </a>
              </div>
            </div>

            {/* Related jobs */}
            {relatedJobs.length > 0 && (
              <div>
                <h2
                  className="text-xl font-bold text-[var(--text-primary)] mb-5"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  More{" "}
                  <span className="text-[var(--action-primary)]">
                    {job.category}
                  </span>{" "}
                  Jobs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedJobs.map((rj) => (
                    <Link
                      key={rj._id}
                      href={`/jobs/${rj._id}`}
                      className="group bg-white border border-[var(--border-subtle)] hover:border-[var(--action-primary)] hover:shadow-md transition-all duration-200 p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 border border-[var(--border-subtle)] flex items-center justify-center bg-[var(--color-neutral-50)]">
                          <Image
                            src={rj.logo}
                            alt={rj.company}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p
                            className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--action-primary)] transition-colors line-clamp-1"
                            style={{
                              fontFamily: "var(--font-sora), sans-serif",
                            }}
                          >
                            {rj.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {rj.company} · {rj.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 border border-current ${TYPE_STYLES[rj.type] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {rj.type}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-muted)]">
                          {rj.salary}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Sticky apply form ── */}
          <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0 sticky top-[6.5rem]">
            {/* Apply form card */}
            <div className="bg-white border border-[var(--border-subtle)] overflow-hidden">
              {/* Card header */}
              <div
                className="px-6 py-5 border-b border-[var(--border-subtle)]"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                }}
              >
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  Apply for this Job
                </h3>
                <p className="text-indigo-200 text-sm mt-0.5">
                  Takes less than 2 minutes
                </p>
              </div>
              <div className="p-6">
                <ApplyForm job={job} />
              </div>
            </div>

            {/* Job quick-info card */}
            <div className="mt-5 bg-white border border-[var(--border-subtle)] p-5 flex flex-col gap-4">
              <h4
                className="text-sm font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                Job Overview
              </h4>
              <Separator />
              {[
                {
                  icon: <MapPin className="w-4 h-4" />,
                  label: "Location",
                  value: job.location,
                },
                {
                  icon: <Briefcase className="w-4 h-4" />,
                  label: "Job Type",
                  value: job.type,
                },
                {
                  icon: <DollarSign className="w-4 h-4" />,
                  label: "Salary",
                  value: job.salary,
                },
                {
                  icon: <Users className="w-4 h-4" />,
                  label: "Experience",
                  value: job.experience,
                },
                {
                  icon: <Building2 className="w-4 h-4" />,
                  label: "Company Size",
                  value: job.companySize,
                },
                {
                  icon: <Clock className="w-4 h-4" />,
                  label: "Posted",
                  value: job.postedAt,
                },
                {
                  icon: <Users className="w-4 h-4" />,
                  label: "Applicants",
                  value: `${job.applicants} applied`,
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--color-brand-100)] flex items-center justify-center shrink-0 text-[var(--action-primary)]">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">{label}</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
