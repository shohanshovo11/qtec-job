import Image from "next/image";
import Link from "next/link";
import { fetchJobs } from "@/lib/api";
import { TYPE_STYLES, getTagStyle } from "@/lib/jobStyles";
import SectionHeader from "./SectionHeader";
import CompanyLogo from "./CompanyLogo";

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
        <SectionHeader
          title={
            <>
              <span className="text-[var(--text-primary)]">Latest </span>
              <span className="text-primary">jobs </span>
              <span className="text-primary">open</span>
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {latestJobs.map((job) => (
            <Link
              key={job._id}
              href={`/jobs/${job._id}`}
              className="bg-white border border-[var(--border-subtle)] hover:border-[var(--action-primary)] hover:shadow-lg transition-all duration-200 p-6 flex items-center gap-5 cursor-pointer group"
            >
              {/* Logo */}
              <CompanyLogo
                logo={job.logo}
                company={job.company}
                size="w-16 h-16"
                imageClassName="object-contain p-2"
              />

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
