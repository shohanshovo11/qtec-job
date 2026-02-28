import Image from "next/image";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  icon: string;
  title: string;
  jobCount: number;
}

export default function CategoryCard({
  icon,
  title,
  jobCount,
}: CategoryCardProps) {
  return (
    <Card
      className="
        group flex flex-col gap-4 p-6 cursor-pointer
        bg-white border border-border rounded-none shadow-none
        hover:bg-brand hover:border-brand
        transition-all duration-300
      "
    >
      {/* Icon */}
      <div className="w-12 h-12 relative shrink-0">
        <Image
          src={icon}
          alt={title}
          fill
          className="object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
        />
      </div>

      {/* Title */}
      <h3
        className="text-lg font-semibold text-foreground group-hover:text-white transition-colors duration-300"
        style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
      >
        {title}
      </h3>

      {/* Jobs count + arrow */}
      <div className="flex items-center gap-3">
        <span
          className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors duration-300"
          style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
        >
          {jobCount} jobs available
        </span>
        <div className="w-5 h-5 relative shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <Image
            src="/icons/arrow-right.svg"
            alt="arrow"
            fill
            className="object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
          />
        </div>
      </div>
    </Card>
  );
}
