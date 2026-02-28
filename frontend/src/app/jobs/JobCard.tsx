import Image from "next/image";
import Link from "next/link";
import { ApiJob } from "@/lib/api";

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
        <div className="w-12 h-12 shrink-0 border border-[var(--border-subtle)] flex items-center justify-center bg-[var(--color-neutral-50)]">
          <Image
            src={job.logo}
            alt={job.company}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
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
