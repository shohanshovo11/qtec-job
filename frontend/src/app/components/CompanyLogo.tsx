import Image from "next/image";

interface CompanyLogoProps {
  logo?: string;
  company: string;
  /** Tailwind size classes for the wrapper, e.g. "w-12 h-12" */
  size?: string;
  /** Extra classes applied to the <Image> */
  imageClassName?: string;
}

export default function CompanyLogo({
  logo,
  company,
  size = "w-12 h-12",
  imageClassName = "object-contain",
}: CompanyLogoProps) {
  return (
    <div
      className={`relative shrink-0 bg-[var(--color-neutral-50)] border border-[var(--border-subtle)] flex items-center justify-center ${size}`}
    >
      {logo ? (
        <Image
          src={logo}
          alt={company}
          fill
          className={imageClassName}
        />
      ) : (
        <span className="text-sm font-bold text-[var(--text-muted)]">
          {company.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
