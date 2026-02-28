import Link from "next/link";
import { ApiJob } from "@/lib/api";
import { TYPE_STYLES, getTagStyle } from "@/lib/jobStyles";
import CompanyLogo from "@/app/components/CompanyLogo";

interface JobCardProps {
  job: ApiJob;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group bg-white border border-[var(--border-subtle)] hover:border-[var(--action-primary)] hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-4 cursor-pointer block"
    >
      {/* Top row: logo + type badge */}
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo logo={job.logo} company={job.company} size="w-12 h-12" />
        <span
          className={`text-xs font-semibold px-3 py-1 border border-current shrink-0 ${TYPE_STYLES[job.type] ?? "bg-gray-100 text-gray-600"}`}
        >
          {job.type}
        </span>
      </div>

      {/* Title + company */}
      <div className="flex flex-col gap-0.5">
        <h3
          className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--action-primary)] transition-colors line-clamp-1"
          style={{
            fontFamily: "var(--font-sora), var(--font-epilogue), sans-serif",
          }}
        >
          {job.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <span>{job.company}</span>
          <span className="text-[var(--border-strong)]">•</span>
          <span>{job.location}</span>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2"
        style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
      >
        {job.description}
      </p>

      {/* Tags + salary row */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-1 border-t border-[var(--border-subtle)] flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs font-medium px-2.5 py-1 ${getTagStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs font-semibold text-[var(--text-secondary)] shrink-0 whitespace-nowrap">
          {job.salary}
        </span>
      </div>

      {/* Posted at */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Posted {job.postedAt}</span>
        <span className="text-[var(--action-primary)] font-semibold text-xs group-hover:underline">
          View Details →
        </span>
      </div>
    </Link>
  );
}
