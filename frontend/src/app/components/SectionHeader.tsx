import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface SectionHeaderProps {
  /** Main heading text — pass JSX for coloured spans */
  title: ReactNode;
  showAllHref?: string;
  showAllLabel?: string;
}

export default function SectionHeader({
  title,
  showAllHref = "/jobs",
  showAllLabel = "Show all jobs",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-12">
      <h2
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]"
        style={{
          fontFamily: "var(--font-sora), var(--font-epilogue), sans-serif",
        }}
      >
        {title}
      </h2>

      <Link
        href={showAllHref}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--action-primary)] hover:text-[var(--action-primary-hover)] transition-colors duration-200 shrink-0"
        style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
      >
        {showAllLabel}
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
  );
}
