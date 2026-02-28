import Image from "next/image";
import Link from "next/link";
import { fetchJobs } from "@/lib/api";

const TAG_COLORS: Record<string, string> = {
  Marketing: "bg-[#FFF6E6] text-[#E88A00]",
  Design: "bg-[#E8F5F0] text-[#14A077]",
  Business: "bg-[#EEF0FF] text-[#4640DE]",
  Technology: "bg-[#FFE9E9] text-[#E05151]",
  Engineering: "bg-[#E8F0FF] text-[#2563EB]",
  Finance: "bg-[#FEF9C3] text-[#A16207]",
  Sales: "bg-[#FCE7F3] text-[#BE185D]",
  "Human Resource": "bg-[#F2ECFF] text-[#7B2FBE]",
};

function getTagColor(tag: string): string {
  for (const [key, val] of Object.entries(TAG_COLORS)) {
    if (tag.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return "bg-[#EEF0FF] text-[#4640DE]";
}

export default async function FeaturedJobsSection() {
  const result = await fetchJobs({
    featured: "true",
    limit: "8",
    sortBy: "newest",
  });
  const featuredJobs = result.data ?? [];

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
            style={{
              fontFamily: "var(--font-sora), var(--font-epilogue), sans-serif",
            }}
          >
            Featured <span className="text-[var(--action-primary)]">jobs</span>
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

        {/* Jobs grid — 4 columns, 32px gap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredJobs.map((job) => (
            <Link
              key={job._id}
              href={`/jobs/${job._id}`}
              className="bg-white border border-[var(--border-subtle)] rounded-none p-6 flex flex-col gap-4 cursor-pointer hover:border-[var(--action-primary)] transition-colors duration-300"
            >
              {/* Logo + badge row */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 relative shrink-0">
                  {job.logo ? (
                    <Image
                      src={job.logo}
                      alt={job.company}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-neutral-100)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-none"
                  style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                >
                  {job.type}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-base font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
              >
                {job.title}
              </h3>

              {/* Company · Location */}
              <p
                className="text-sm text-[var(--text-secondary)] flex items-center gap-1"
                style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
              >
                <span>{job.company}</span>
                <span className="text-[var(--border-strong)]">•</span>
                <span>{job.location}</span>
              </p>

              {/* Description */}
              <p
                className="text-sm text-[var(--text-muted)] line-clamp-2"
                style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
              >
                {job.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {job.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getTagColor(tag)}`}
                    style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
