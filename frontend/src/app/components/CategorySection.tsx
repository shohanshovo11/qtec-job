import Image from "next/image";
import Link from "next/link";
import CategoryCard from "./CategoryCard";
import { fetchCategories } from "@/lib/api";

const CATEGORY_ICONS: Record<string, string> = {
  Design: "/icons/Category/Icon.svg",
  Sales: "/icons/Category/Icon-1.svg",
  Marketing: "/icons/Category/Icon-2.svg",
  Finance: "/icons/Category/Icon-3.svg",
  Technology: "/icons/Category/Icon-4.svg",
  Engineering: "/icons/Category/Icon-5.svg",
  Business: "/icons/Category/Icon-6.svg",
  "Human Resource": "/icons/Category/Icon-7.svg",
};

export default async function CategorySection() {
  const liveCategories = await fetchCategories();
  const countMap = Object.fromEntries(
    liveCategories.map((c) => [c.name, c.jobCount]),
  );

  const categories = Object.entries(CATEGORY_ICONS).map(([title, icon]) => ({
    icon,
    title,
    jobCount: countMap[title] ?? 0,
  }));
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground"
            style={{
              fontFamily: "var(--font-sora), var(--font-epilogue), sans-serif",
            }}
          >
            Explore by <span className="text-brand">category</span>
          </h2>

          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors duration-200 shrink-0"
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

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.title}
              icon={cat.icon}
              title={cat.title}
              jobCount={cat.jobCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
