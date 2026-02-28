import Link from "next/link";
import { fetchJobs } from "@/lib/api";
import { getTagStyle } from "@/lib/jobStyles";
import SectionHeader from "./SectionHeader";
import CompanyLogo from "./CompanyLogo";

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
        <SectionHeader
          title={
            <>
              Featured <span className="text-[var(--action-primary)]">jobs</span>
            </>
          }
        />

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
                <CompanyLogo logo={job.logo} company={job.company} size="w-12 h-12" />
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
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getTagStyle(tag)}`}
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
