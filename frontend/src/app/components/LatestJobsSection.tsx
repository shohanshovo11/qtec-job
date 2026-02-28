import Image from "next/image";
import Link from "next/link";
import { fetchJobs } from "@/lib/api";

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

export default async function LatestJobsSection() {
  const result = await fetchJobs({ sortBy: "newest", limit: "8" });
  const latestJobs = result.data ?? [];

  return (
    <section className="w-full bg-[#F8F8FD] py-20 relative overflow-hidden">
      {/* Decorative pattern — right side */}
      <div className="absolute right-[80px] top-0 h-full w-[340px] pointer-events-none select-none">
        <Image
          src="/images/Pattern.png"
          alt=""
          fill
          className="object-cover object-left"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
          >
            <span className="text-[var(--text-primary)]">Latest </span>
            <span className="text-primary">jobs </span>
            <span className="text-primary">open</span>
          </h2>

          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--action-primary)] hover:text-[var(--action-primary-hover)] transition-colors duration-200 shrink-0"
            style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
          >
            Show all jobs
            <div className="w-5 h-5 relative">
              <Image
                src="/icons/arrow-right.svg"
                alt="arrow"
                fill
                className="object-contain"
                style={{
                  filter:
                    "invert(27%) sepia(93%) saturate(1352%) hue-rotate(224deg) brightness(97%) contrast(97%)",
                }}
              />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {latestJobs.map((job) => (
            <Link
              key={job._id}
              href={`/jobs/${job._id}`}
              className="bg-white border border-[var(--border-subtle)] hover:border-[var(--action-primary)] hover:shadow-lg transition-all duration-200 p-6 flex items-center gap-5 cursor-pointer group"
            >
              {/* Logo */}
              <div className="w-16 h-16 relative shrink-0 bg-[var(--color-neutral-50)] border border-[var(--border-subtle)] flex items-center justify-center">
                {job.logo ? (
                  <Image
                    src={job.logo}
                    alt={job.company}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="text-lg font-bold text-[var(--text-muted)]">
                    {job.company.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2 min-w-0">
                <h3
                  className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--action-primary)] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                >
                  {job.title}
                </h3>
                <p
                  className="text-sm text-[var(--text-secondary)] flex items-center gap-1"
                  style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                >
                  <span>{job.company}</span>
                  <span className="text-[var(--border-strong)]">•</span>
                  <span>{job.location}</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span
                    className={`text-xs font-semibold px-3 py-1 border border-current ${TYPE_STYLES[job.type] ?? "bg-gray-100 text-gray-600"}`}
                    style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                  >
                    {job.type}
                  </span>
                  {job.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs font-medium px-2.5 py-1 ${getTagStyle(tag)}`}
                      style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
